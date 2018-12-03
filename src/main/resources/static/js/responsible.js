$.fn.form.settings.rules.isValidCpf = function(value) {
	var cpf = value.replace(/[^\d]+/g,'');	
	if (cpf == '') return false;	
	if (cpf.length != 11 || 
		cpf == "00000000000" || cpf == "11111111111" || cpf == "22222222222" || cpf == "33333333333" || 
		cpf == "44444444444" || cpf == "55555555555" || cpf == "66666666666" || cpf == "77777777777" || 
		cpf == "88888888888" || cpf == "99999999999")
		return false;		
	
	var add = 0;	
	for (var i=0; i < 9; i++) add += parseInt(cpf.charAt(i)) * (10 - i);	
	var rev = 11 - (add % 11);	
	if (rev == 10 || rev == 11) rev = 0;	
	if (rev != parseInt(cpf.charAt(9))) return false;		

	add = 0;	
	for (i = 0; i < 10; i ++) add += parseInt(cpf.charAt(i)) * (11 - i);	
	rev = 11 - (add % 11);	
	if (rev == 10 || rev == 11) rev = 0;	
	if (rev != parseInt(cpf.charAt(10))) return false;
	
	return true;   
};				

var responsible = (function(){
	var datatable = null;
	var listResponsible = [];
	return {
		getDatatable: function() { return datatable; },
		getResponsibles: function() { return listResponsible; },
		setResponsibles: function(values) { listResponsible = values; },
		getRemoveMessage: function() {
			return { "title": "Respons&aacute;vel eliminado", "message": "O respons&aacute;vel foi eliminado com sucesso!"}
		},
		start: function() {
			$(".loading").show();
			$.get('templates/responsible/query.mst', function(tpl) {
				var html = Mustache.render(tpl, {"code": "responsavel" });
				$("main").append(html);
				responsibleEvents.setup();
				$("#cpf").mask('000.000.000-00');
				responsible.loadDatatable();
			});
		},
		loadDatatable: function(){
			var options = {
				type: 'GET',
				dataType: 'json',
				contentType : 'application/json',
				url: '/responsaveis'					
			};
			$(".loading").show();
			main.request(options).then(function(data) {
				var options = {
					type: 'GET',
					dataType: 'json',
					contentType : 'application/json',
					url: '/processos'					
				};
				main.request(options).then(function(result) {
					$(".loading").hide();
					for (var y=0; y<data.length; y++) {
						var resp = data[y];
						resp["process"] = "";
						for (var i=0; i<result.length; i++) {
							var row = result[i];
							var list = row["responsibles"];
							for (var x=0; x<list.length; x++) {
								var r = list[x];
								if (resp["id"] == r["id"]) {
									resp["process"] = (resp["process"] == "" ? row["number"] : resp["process"] + " - " + row["number"]);
								}
							}
						}
						data[y] = resp; 
					}
					responsible.setResponsibles(data);
					if (typeof legalprocess !== 'undefined') { legalprocess.refreshFilter(data); }
					if (datatable == null) {
						datatable = $("#tableResponsibles").DataTable( {
					        data: responsible.getResponsibles(),
					        searching: true,
					        order: [[ 0, "asc" ]],
					        columns: [
					            { data: 'name' },
					            { data: 'cpf' },
					            { data: 'process' },
					            { data: 'id', render: function ( data, type, row ) {
				                    if (type === 'display') {
				                    	var html = '<div class="ui vertical animated button click-edit-responsible" data-id="' + data + '" tabindex="0"><div class="hidden content">Editar</div><div class="visible content"><i class="edit icon"></i></div></div>';
				                    	if (row["process"] == "") {
				                    		html += '<div class="ui vertical animated button click-remove-responsible" data-id="' + data + '" tabindex="0"><div class="hidden content">Remover</div><div class="visible content"><i class="trash icon"></i></div></div>';
				                    	}
				                    		
				                        return html;
				                    }
				                    return data;
				                }}
					        ],
							"oLanguage": {
								"sUrl": "datatable/language/pt-br.json"
							}
					    } );
					} else {
						datatable.clear().draw();
						datatable.rows.add(data); 
						datatable.columns.adjust().draw(); 						
					}
					responsibleEvents.actionsDatatable();
				}).catch(function(error) {
					$(".loading").hide();
					util.showMessage("error", "Erro buscar processos", error);
					$(".loading").hide();
				});
			}).catch(function(error) {
				$(".loading").hide();
				util.showMessage("error", "Erro buscar responsaveis", error);
				$(".loading").hide();
			});
		},
		upload: function() {
			var data = new FormData($("#fileUploadForm")[0])
			
			$(".loading").show();
			var options = {
		        url: "/upload",
		        type: "POST",
		        data: data,
		        enctype: 'multipart/form-data',
		        processData: false,
		        contentType: false,
		        cache: false,
			};
			main.request(options).then(function(data) {
	        	$("#user-avatar").attr("src", "data:image/png;base64," + data);
	        	$("#avatar").val("data:image/png;base64," + data);
				$(".loading").hide();
			}).catch(function(error) {
				util.showMessage("error", "Erro buscar responsaveis", error);
				$(".loading").hide();
			});
		},
		showWindow: function(data) {
			$.get('templates/responsible/crud.mst', function(tpl) {
				var html = Mustache.render(tpl, data);
				$(".modal-add-responsible").html(html);
				$('.cpf').mask('000.000.000-00', {reverse: true});
				$('.modal-add-responsible').modal('show');
				$('.form-add-responsible').form({
					inline : true,
					on: 'blur',
					fields: {
						nomeAdd: {
					        identifier: 'nomeAdd',
					        rules: [{
					            type   : 'empty',
					            prompt : 'Informe o nome!'
					        },{
					            type   : 'maxLength[150]',
					            prompt : 'Nome deve ter no maximo 150 caracteres!'
					        }]
						},
						cpfAdd: {
					        identifier: 'cpfAdd',
					        rules: [{
					            type   : 'empty',
					            prompt : 'Informe o CPF!'
					        },{
					            type: 'isValidCpf',
					            prompt: 'Informe um CPF valido!'
					          }]
						},
						emailAdd: {
					        identifier: 'emailAdd',
					        rules: [{
					            type   : 'empty',
					            prompt : 'Informe o e-mail!'
					        },{
					            type   : 'email',
					            prompt : 'Informe um e-mail valido!'
					        }]
						},
				    }
				});
				$(".loading").hide();
				
			});
		}
	}
})();

var responsibleEvents = (function(){
	var current = null;
	return {
		setup: function() {
			
			$.event.trigger({ type: "legalProcessCreated" });
			$.event.trigger({ type: "legalProcessRemove" });

			$(document).on("legalProcessCreated", function (ev, data) { responsible.loadDatatable(); });
			$(document).on("legalProcessRemove", function (ev, data) { responsible.loadDatatable(); });
			
			$(".search-responsible").keyup(function(ev) {
				var datatable = responsible.getDatatable();
				datatable.columns(+($(ev.currentTarget).data("column"))).search(this.value).draw();
			})
			
			$(document).on('change', '#userAvatar', function(ev) { responsible.upload(); });
			
			$(".click-menu-item").click(function (ev) {
				$(".click-menu-item").removeClass("active");
				$(ev.currentTarget).addClass("active");
				$(".mypage").hide();
				$(".page-" + $(ev.currentTarget).data("page")).show();
			});
			
			
			$(document).on('click', '.btn-adicionar-responsavel', function(ev) {
				var data = {
					"title": "Novo Respons&aacute;vel",
					"id": "",
					"nome": "",
					"cpf": "",
					"email": "",
					"method": "POST",
					"photo": "/images/user.png"
				}
				
				responsible.showWindow(data);
				
			});
			$(document).on('click', '.btn-save-responsible', function(ev) {
				$('.form-add-responsible').form('validate form');
				if( $('.form-add-responsible').form('is valid')) {
					var data = {
						"id": $("#idAdd").val(),
						"name": $("#nomeAdd").val(),
						"cpf": $("#cpfAdd").val(),
						"email": $("#emailAdd").val(),
						"photo": $("#avatar").val()
					}
					
					$(".loading").show();
					var options = {
						type: "POST",
						dataType: 'json',
						contentType : 'application/json',
						data: JSON.stringify(data),
						url: '/responsavel',
					};
					main.request(options).then(function(result) {
						$('.modal-add-responsible').modal('hide');
						if ($("#methodAdd").val() == "POST") {
							util.showMessage("success", "Respons&aacute;vel cadastrado", "O respons&aacute;vel " + $("#nomeAdd").val() + " foi cadastrado com sucesso!")
						} else if ($("#methodAdd").val() == "PUT") {
							util.showMessage("success", "Respons&aacute;vel alterado", "O respons&aacute;vel " + $("#nomeAdd").val() + " foi alterado com sucesso!")
						}
						responsible.loadDatatable();
						$(document).trigger("responsibleCreated", [data]);
						$(".loading").hide();
					}).catch(function(response) {
						$(".loading").hide();
						if (response["responseJSON"] && response["responseJSON"].error) {
							var f = $("#" + response["responseJSON"].field).parent();
							f.addClass("error");
							f.append('<div class="ui basic red pointing prompt label transition visible">' + response["responseJSON"].error + '</div>');
						} else {
							util.showMessage("error", "Erro ao criar responsavel", response["responseText"]);
						} 
					});
				}
			});
		},
		actionsDatatable: function() {
			$(document).on('click', '.click-edit-responsible', function(ev) {
				var datatable = responsible.getDatatable();				
				var tochange = null;
				datatable.data().each( function (row) {
					if (row["id"] == $(ev.currentTarget).data("id")) {
						tochange = row;
						return;
					}
				});
				if (tochange) {
					tochange["title"] = "Editar respons&aacute;vel";
					tochange["method"] = "PUT";
					responsible.showWindow(tochange);
					
				}
			})
			$(document).on('click', '.click-remove-responsible', function(ev) {
				var datatable = responsible.getDatatable();				
				var toremove = null;
				datatable.data().each( function (row) {
					if (row["id"] == $(ev.currentTarget).data("id")) {
						toremove = row;
						return;
					}
				});
				if (toremove) {
					var data = {
						"title": "Eliminar respons&aacute;vel",
						"message": "Confirmar a elimina&ccedil;&atilde;o do respons&aacute;vel " + toremove["name"] + "?",
						"path": "responsavel",
						"id": toremove["id"],
						"js": "responsible",
						"event": "responsibleRemove"
					}
					var tpl = $('.tpl-delete').html();
					var html = Mustache.render(tpl, data);
					$(".modal-delete").html(html);
					$(".modal-delete").modal("show");
				}
				
			})
		}
	}
})();

$(document).ready(function() {
	responsible.start();
});