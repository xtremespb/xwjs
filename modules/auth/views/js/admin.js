$(document).ready(function() {
	$('#xwjs_admin_users_table').xwjsTable({
		items_array: "users",
		sort_column: "username",
		sortable_columns: ["username", "realname", "email", "status"],
		items_per_page: 3,
		lang: {
			ajax_error: i18n.ajax_error,
			ajax_fail: i18n.ajax_fail
		},
		render: function(field, item) {
			if (item[field] === undefined || item[field] === null) item[field] = "";
			var render_html;
			switch (field) {
				case "status":
					switch (item[field]) {
						case 0:
							render_html = '<td class="xwjs-text-center">' + i18n.user_disabled;
							break;
						case 1:
							render_html = '<td class="xwjs-text-center">' + i18n.user_active;
							break;
						case 2:
							render_html = '<td class="xwjs-text-center">' + i18n.user_admin;
							break;
					}
					break;
				default:
					render_html = "<td>" + item[field];
			}
			render_html += "</td>";
			return render_html;
		}
	});
});