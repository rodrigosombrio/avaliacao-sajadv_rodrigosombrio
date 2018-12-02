var textCalendar = {
	days: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
	months: ['Janeiro', 'Fevereiro', 'Marco', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
	monthsShort: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'],
	today: 'Hoje',
	now: 'Agora',
	am: 'AM',
	pm: 'PM'
}

var util = (function(){
	return {
		start: function() {
			utilEvents.setup();
		},
		showMessage: function(type, header, message) {
			var tpl = $('.tpl-message').html();
			var data = { "type": type, "header": header, "message": message};
			var html = Mustache.render(tpl, data);
			$(".modal-message").html(html);
			$(".modal-message").modal("show");
		}
	}
})();

var utilEvents = (function(){
	var current = null;
	return {
		setup: function() {
			$(document).on('click', '.btn-confirm-remove', function(ev) {
				var options = {
					type: "DELETE",
					contentType : 'application/json',
					url: '/' + $(ev.currentTarget).data("path") + "/" + $(ev.currentTarget).data("id"),
		        };					
				$(".loading").show();
				main.request(options).then(function(data) {
					$(".loading").hide();
					var mess = window[$(ev.currentTarget).data("js")]["getRemoveMessage"]();
					util.showMessage("success", mess["title"], mess["message"])
					window[$(ev.currentTarget).data("js")]["loadDatatable"]();
					$(document).trigger($(ev.currentTarget).data("event"), [$(ev.currentTarget).data("id")]);
				}).catch(function(error) {
					util.showMessage("error", "Erro eliminar o resgistro", error);
					$(".loading").hide();
				});
			});
		}
	}
})();

$(document).ready(function() {
	util.start();
});