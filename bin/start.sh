#!/bin/sh
### BEGIN INIT INFO
# Provides:          xwjs_start
# Required-Start:
# Required-Stop:
# Default-Start:     2 3 4 5
# Default-Stop:      0 1 6
# Short-Description: Start xw.js server
# Description:       This script is used to run the xw.js instance
### END INIT INFO

. /lib/lsb/init-functions
export NODE_PATH=$NODE_PATH:/usr/lib/node_modules

# Set the correct path
xwjs_dir="/var/www/xwjs"

# All other values can be left as is
xwjs_minuptime=1000
xwjs_spinsleeptime=1000
name="xwjs_start"
pid_file="$xwjs_dir/run/xwjs.pid"
stdout_log="$xwjs_dir/logs/xwjs_stdout.log"
stderr_log="$xwjs_dir/logs/xwjs_stderr.log"
cmd_start="forever --pidFile $pid_file --sourceDir $xwjs_dir/bin -l $xwjs_dir/logs/xwjs_forever.log -a --minUptime $xwjs_minuptime --spinSleepTime $xwjs_spinsleeptime start server.js"
cmd_stop="forever stop $xwjs_dir/bin/server.js"

get_pid() {
    cat "$pid_file"
}

is_running() {
    [ -f "$pid_file" ] && ps `get_pid` > /dev/null 2>&1
}

case "$1" in
    start)
    if is_running; then
        echo "Already started"
    else
        echo "Starting $name"
        cd "$xwjs_dir"
        exec $cmd_start >> "$stdout_log" 2>> "$stderr_log" &
        echo $! > "$pid_file"
        if ! is_running; then
            echo "Unable to start, see $stdout_log and $stderr_log"
            exit 1
        fi
    fi
    ;;
    stop)
    if is_running; then
        echo -n "Stopping $name.."
        cd "$xwjs_dir"
        exec $cmd_stop >> "$stdout_log" 2>> "$stderr_log" &
        for i in {1..10}
        do
            if ! is_running; then
                break
            fi

            echo -n "."
            sleep 1
        done
        echo

        if is_running; then
            echo "Not stopped; may still be shutting down or shutdown may have failed"
            exit 1
        else
            echo "Stopped"
            if [ -f "$pid_file" ]; then
                rm "$pid_file"
            fi
        fi
    else
        echo "Not running"
    fi
    ;;
    restart)
    $0 stop
    if is_running; then
        echo "Unable to stop, will not attempt to start"
        exit 1
    fi
    $0 start
    ;;
    status)
    if is_running; then
        echo "Running"
    else
        echo "Stopped"
        exit 1
    fi
    ;;
    *)
    echo "Usage: $0 {start|stop|restart|status}"
    exit 1
    ;;
esac

exit 0

