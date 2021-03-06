;
(function($, window, document, undefined) {
    // Defaults
    var plugin_name = "xwjsTable",
        defaults = {
            load_data_method: "POST",
            items_array: "items",
            sort_column: undefined,
            sort_direction: 1,
            items_per_page: 50,
            sortable_columns: undefined,
            loading_image: "data:image/gif;base64,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",
            lang: {
                ajax_error: "Error while loading data from server",
                ajax_fail: "Could not connect to the server"
            },
            render: function(field, item) {
                if (item[field] === undefined || item[field] === null) item[field] = "";
                return "<td>" + item[field] + "</td>";
            }
        };

    // The actual plugin constructor
    function xwjsTable(element, options) {
        this.element = element;
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = plugin_name;
        this.init();
    }
    // Avoid xwjsTable.prototype conflicts
    $.extend(xwjsTable.prototype, {
        init: function() {
            // Initialization logic
            var _this = this;
            this.class_name = "-" + this.element.id + "-table";
            this.page = 1;
            $(this.element).addClass(this.class_name);
            this.settings.url = $(this.element).attr("xwjs-data-source");
            if (this.settings.sort_column) {
                this.current_sort_column = this.settings.sort_column;
                this.current_sort_direction = this.settings.sort_direction;
                $('.' + this.class_name + '>thead>tr>th[xwjs-th-id="' + this.settings.sort_column + '"]').append('<span class="-' + this.element.id + '-sort-icon">&nbsp;<i class="xwjs-icon-sort-' + (this.settings.sort_direction == 1 ? "down" : "up") + '"></i></span>');
                if (!this.settings.sortable_columns) {
                	$('.' + this.class_name + '>thead>tr>th').css("cursor", "pointer");
                } else {
                	for (var i in this.settings.sortable_columns)
                		$('.' + this.class_name + '>thead>tr>th[xwjs-th-id="' + this.settings.sortable_columns[i] + '"]').css("cursor", "pointer");
                }
                $('.' + this.class_name + '>thead>tr>th').css("user-select", "none").click(function() {
                    _this.header_click(this);
                });;
            }
            this.load_data();
        },
        load_data: function() {
            var _this = this;
            _this.show_loading(true);
            $.ajax({
                    method: this.settings.load_data_method,
                    url: this.settings.url,
                    data: {
                    	page: this.page,
                    	items_per_page: this.settings.items_per_page,
                    	sort_column: this.current_sort_column,
                    	sort_direction: this.current_sort_direction
                    }
                })
                .done(function(data) {
                    if (data && data.err_code === 0) {
                        _this.render_table(data[_this.settings.items_array]);
                    } else {
                        UIkit.notify({
                            message: _this.settings.lang.ajax_error,
                            status: 'danger',
                            timeout: 2000,
                            pos: 'top-center'
                        });
                    }
                })
                .fail(function() {
                    UIkit.notify({
                        message: _this.settings.lang.ajax_fail,
                        status: 'danger',
                        timeout: 2000,
                        pos: 'top-center'
                    });
                })
                .done(function() {
                	_this.show_loading(false);
                });

        },
        render_table: function(data) {
            // Render table
            var _this = this;
            $(this.element).find("tbody>tr").empty();
            for (var i in data) {
                var row_html = "<tr>";
                $(this.element).find("thead>tr").children().each(function() {
                    var id = $(this).attr("xwjs-th-id");
                    row_html += _this.settings.render(id, data[i]);
                });
                row_html += "</tr>";
                $(_this.element).find("tbody").append(row_html);
            }
        },
        show_loading: function(show) {
            $('#-' + this.class_name + '-loading').remove();
            if (!show) return;
            $(this.element).parent().append('<div style="position:absolute;background:#fff;opacity:0.5" id="-' + this.class_name + '-loading"></div>');
            $('#-' + this.class_name + '-loading').css("left", $(this.element).position().left).css("top", $(this.element).position().top).css("width", $(this.element).width()).css("height", $(this.element).height()).append('<img src="' + this.settings.loading_image + '" id="-' + this.class_name + '-loading-image" style="position:absolute">');
            $('#-' + this.class_name + '-loading-image').css("left", $(this.element).width() / 2 - $('#-' + this.class_name + '-loading-image').width() / 2).css("top", $(this.element).height() / 2 - $('#-' + this.class_name + '-loading-image').height() / 2);
        },
        header_click: function(item) {
            if (this.settings.sortable_columns && $.inArray($(item).attr("xwjs-th-id"), this.settings.sortable_columns) === -1) return;
            $('.-' + this.element.id + '-sort-icon').remove();
            if (this.current_sort_column == $(item).attr("xwjs-th-id")) {
                this.current_sort_direction *= -1;
            } else {
                this.current_sort_column = $(item).attr("xwjs-th-id");
                this.current_sort_direction = 1;
            }
            $('.' + this.class_name + '>thead>tr>th[xwjs-th-id="' + this.current_sort_column + '"]').append('<span class="-' + this.element.id + '-sort-icon">&nbsp;<i class="xwjs-icon-sort-' + (this.current_sort_direction == 1 ? "down" : "up") + '"></i></span>');
            this.load_data();
        }
    });
    // Plugin wrapper around the constructor, preventing against multiple instantiations
    $.fn[plugin_name] = function(options) {
        return this.each(function() {
            if (!$.data(this, "plugin_" + plugin_name)) {
                $.data(this, "plugin_" +
                    plugin_name, new xwjsTable(this, options));
            }
        });
    };
})(jQuery, window, document);
