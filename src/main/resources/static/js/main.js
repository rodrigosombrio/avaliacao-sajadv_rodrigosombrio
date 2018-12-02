var main = (function(){
	var hasLoaded = {}
	return {
		start: function() {
			mainEvents.setup();
			main.loadMenu();
		},
		request: function (options) {
			return new Promise(function(resolve, reject) {
				options["success"] = function (result) { resolve(result); };
				options["error"] = function (xhr, status, error) { reject(xhr); };
				$.ajax(options);
			});
		},
		loadJs: function(source) {
			var head = document.getElementsByTagName('head')[0];
			var script = document.createElement('script');
			script.type = 'text/javascript';
			script.src = source;
			head.appendChild(script);			
			hasLoaded[source] = true;
		},
		loadMenu: function() {
			var options = {
				type: 'GET',
				dataType: 'json',
				contentType : 'application/json',
				url: '/menu'					
			}
			main.request(options).then(function(result) {
				$.get('templates/menu.mst', function(tpl) {
					var menu = [];
					for (var i=0; i<result.length; i++) {
						var row = result[i];
						var o = {
							"active": (i == 0 ? "active" : ""),
							"page": row["code"],
							"label": row["label"],
							"controller": row["jsController"]
						}
						menu.push(o);
					}
					var data = {"menu": menu};
					var html = Mustache.render(tpl, data);
					$(".page-header").html(html);
					
					main.showPage($(".click-menu-item.active"));
					
				});
			}).catch(function(error) {
				console.log("catch", error)
			});
		},
		showPage: function(item) {
			$(".click-menu-item").removeClass("active");
			$(item).addClass("active");
			$(".loading").hide();
			$(".page").hide();
			if (!hasLoaded[$(item).data("controller")]) { main.loadJs($(item).data("controller")) }
			else { $(".page-" + $(item).data("page")).show(); }
		}
	}
})();

var mainEvents = (function(){
	var current = null;
	return {
		setup: function() { 
			$(document).on('click', '.click-menu-item', function(ev) { main.showPage(ev.currentTarget); });
		}
	}
})();

$(document).ready(function() {
	main.start();
});