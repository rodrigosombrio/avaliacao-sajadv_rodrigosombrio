$.fn.dataTable.ext.search.push(
    function( settings, data, dataIndex ) {
    	console.log(settings, data, dataIndex )
    	if (settings["sTableId"] == "tableLegalProcess") {
        	if (!$("#distribuicaoInicio").val() || !$("#distribuicaoFim").val()) return true;
        	if ($("#distribuicaoInicio").val() == "" || $("#distribuicaoFim").val() == "") return true;
        	
        	var di = $("#distribuicaoInicio").val().split("/");
        	var df = $("#distribuicaoFim").val().split("/");
        	
        	var mi = moment(di[2] + "-" + di[1] + "-" + di[0]);
        	var mf = moment(df[2] + "-" + df[1] + "-" + df[0]);
        	
        	var m = moment(data[1]);
        	if (m.isSameOrAfter(mi) && m.isSameOrBefore(mf)) return true;
        	
            return false;
    	}
    	return true;
    }
);


var Situation = {
	Em_Andamento: "Em_Andamento",
	Desmembrado: "Desmembrado",
	Em_Recurso: "Em_Recurso",
	Finalizado: "Finalizado",
	Arquivado: "Arquivado",
	properties: {
		"Em_Andamento": {name: "Em andamento", value: false},
		"Desmembrado": {name: "Desmembrado", value: false},
		"Em_Recurso": {name: "Em recurso", value: false},
		"Finalizado": {name: "Finalizado", value: true},
		"Arquivado": {name: "Arquivado", value: true}
	}
};

var legalprocess = (function(){
	var datatable = null;
	var codePage = "";
	var listProcess = [];
	var listResponsibles = [];
	var structure = {};
	return {
		setCode: function(value) { codePage = value; },
		getCode: function() { return codePage; },
		start: function() {
			moment.locale('pt-BR');
			$.get('templates/legalprocess/query.mst', function(tpl) {
				var html = Mustache.render(tpl, {"code": "processo" });
				$("main").append(html);

				legalprocessEvents.setup();
				$("#filtroNumeroProcesso").mask("0000000-00.0000.0.00.0000");
				$("#distribuicaoInicioCalendar").calendar({ 
					type: 'date',
					endCalendar: $('#distribuicaoFimCalendar'),
					formatter: {
						date: function (date, settings) {
							if (!date) return '';
							var day = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate());
							var month = (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1);
							var year = date.getFullYear();
							return day + '/' + month + '/' + year;
						}
					},
					maxDate: new Date(),
					onChange: function (date, text, mode) { 
						var datatable = legalprocess.getDatatable();
						setTimeout(function() {
							datatable.columns(1).search().draw();
						}, 200);
					},
					text: textCalendar
				});
				$("#distribuicaoFimCalendar").calendar({ 
					type: 'date',
					startCalendar: $('#distribuicaoInicioCalendar'),
					formatter: {
						date: function (date, settings) {
							if (!date) return '';
							var day = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate());
							var month = (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1);
							var year = date.getFullYear();
							return day + '/' + month + '/' + year;
						}
					},
					maxDate: new Date(),
					onChange: function (date, text, mode) { 
						var datatable = legalprocess.getDatatable();
						setTimeout(function() {
							datatable.columns(1).search().draw();
						}, 200);
					},
					text: textCalendar
				});
				$(".page-responsavel").hide();
				legalprocess.loadResponsibles();
				legalprocess.loadDatatable();
			});
		},
		getDatatable: function() { return datatable; },
		getStructure: function() { return structure; },
		getResponsibles: function() { return listResponsibles; },
		setResponsibles: function(values) { listResponsibles = values }, 
		getLegalProcess: function() { return listProcess; },
		setLegalProcess: function(values) { 
			listProcess = values;
			legalprocess.hierarchyProcess();
		},
		hierarchyProcess: function() {
			structure = {};
			for (var i=0; i<listProcess.length; i++) {
                var row = listProcess[i];
                if (!structure[row["id"]]) {
                    structure[row["id"]] = {};
                    structure[row["id"]].children = [];
                    structure[row["id"]].father = 0;
                }
                if (row["processFather"] != "" && row["processFather"] != null) {
                    if (!structure[row["processFather"].id]) {
                        structure[row["processFather"].id] = {};
                        structure[row["processFather"].id].children = [];
                        structure[row["processFather"].id].father = 0;
                    }
                    structure[row["id"]].father = row["processFather"].id;
                    structure[row["processFather"].id].children.push(row["id"]);
                }
            }
		},
		getRemoveMessage: function() { return { "title": "Processo eliminado", "message": "O processo foi eliminado com sucesso!"} },
		refreshFilter: function(list) {
			if (list.length > 0) {
				var tpl = $('.tpl-filtro-responsavel').html();
				var data = { "responsibles": list};
				var html = Mustache.render(tpl, data);
				$("#filtroResponsavel").html(html);
				setTimeout(function() {
					$("#filtroResponsavel").dropdown({
						onChange: function() {
							var datatable = legalprocess.getDatatable();
							datatable.columns(+($(this).data("column"))).search(this.value).draw();
						}
					});
				}, 300);
			}
		},
		loadResponsibles: function() {
			$(".loading").show();
			console.log("loading")
			var options = {
				type: 'GET',
				dataType: 'json',
				contentType : 'application/json',
				url: '/responsaveis'
	        };					
			main.request(options).then(function(data) {
				$(".loading").hide();
				legalprocess.setResponsibles(data);
				legalprocess.refreshFilter(data);
				$(".loading").hide();
			}).catch(function(error) {
				$(".loading").hide();
			});
			
		},
		loadDatatable: function() {
			$(".loading").show();
			var options = {
				type: 'GET',
				dataType: 'json',
				contentType : 'application/json',
				url: '/processos'					
			};
			main.request(options).then(function(data) {
				legalprocess.setLegalProcess(data);
				for (var i=0; i<data.length; i++) {
					var row = data[i];
					if (!row["processFather"]) row["processFather"] = "";
					
					var name = "";
					var id = "";
					for (var x=0; x<row["responsibles"].length; x++) {
						var line = row.responsibles[x];
						name = (name == "" ? line["name"] : name + ", " + line["name"]);
						id = (id == "" ? line["id"] : id + "," + line["id"]);
					}
					row["responsibleName"] = name;
					row["responsibleId"] = "" + id;
				    delete row["responsibles"];
					data[i] = row;
				}
				if (datatable == null) {
					datatable = $("#tableLegalProcess").DataTable( {
				        data: data,
				        searching: true,
				        order: [[ 0, "asc" ]],
				        columns: [
				            { data: 'number' },
				            { data: 'distributionDate', render: function ( data, type, row ) {
			                    if (type === 'display') {
			                    	if (data) {
			                        	var m = moment(data);
				                    	return m.format("DD/MM/YYYY");
			                    	}
			                    }
			                    return data;
			                } },
				            { data: 'justiceSecret', render: function ( data, type, row ) {
			                    if (type === 'display') {
			                    	if (data) { return "Sim"; }
			                    	return "N&atilde;o";
			                    }
			                    return data;
			                } },
				            { data: 'physicalFolder' },
				            { data: 'description' },
				            { data: 'situation' , render: function ( data, type, row ) {
			                    if (type === 'display') {
			                    	return Situation.properties[data].name;
			                    }
			                    return data;
			                } },
				            { data: 'responsibleName' },
				            { data: 'responsibleId', "visible": false, "searchable": false },
				            { data: 'id', render: function ( data, type, row ) {
			                    if (type === 'display') {
			                    	var html = '<div class="ui vertical animated button click-edit-process" data-id="' + data + '" tabindex="0"><div class="hidden content">Editar</div><div class="visible content"><i class="edit icon"></i></div></div>';
			                    	var h = structure[data];
			                    	if (row["situation"] != "Finalizado") {
			                    		if (h["children"].length == 0) {
			                    			html += '<div class="ui vertical animated button click-remove-process" data-id="' + data + '" tabindex="0"><div class="hidden content">Remover</div><div class="visible content"><i class="trash icon"></i></div></div>';
			                    		}
			                    	}
			                    	if (h["father"] != 0 || h["children"].length != 0) {
			                    		html += '<div class="ui vertical animated button click-show-process-father" data-id="' + data + '" tabindex="0"><div class="hidden content">Vinc</div><div class="visible content"><i class="list alternate outline icon"></i></div></div>';
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
				legalprocessEvents.actionsDatatable();
				$(".loading").hide();
			}).catch(function(error) {
				$(".loading").hide();
			});
		},
		showWindow: function(data) {
			$.get('templates/legalprocess/crud.mst', function(tpl) {
				var html = Mustache.render(tpl, data);
				$(".modal-add-process").html(html);
				
				if (data["method"] == "PUT") {
					$("#situacao").val(data["situation"]);
					if (data["processFather"] && data["processFather"] != "" && data["processFather"].id) {
						$('#processoPai').dropdown('set selected', data["processFather"].id);
					}
					if (data["situation"] == "Finalizado") {
						$("#situacao").prop("disabled", true);
						$("#processoPai").prop("disabled", true);
						$("#processoPai").parent().addClass("disabled");
						$("#listResponsible").prop("disabled", true);
						$("#processoUnificado").prop("disabled", true);
						$("#dataDistribuicao").prop("disabled", true);
						$("#pastaFisica").prop("disabled", true);
						$("#segredoJustica").prop("disabled", true);
						$("#descricao").prop("disabled", true);
						$(".btn-save-process").hide();
					} else {
						$(".btn-save-process").show();
					}
				}
				
				$('.modal-add-process').modal('show');
				
				setTimeout(function() {
					$("#listResponsible").dropdown();
					$("#processoPai").dropdown();
					$("#distribuicaoAdd").calendar({ 
						type: 'date',
						formatter: {
							date: function (date, settings) {
								if (!date) return '';
								var day = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate());
								var month = (date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1);
								var year = date.getFullYear();
								return day + '/' + month + '/' + year;
							}
						},
						maxDate: new Date(),
						text: textCalendar
					});
					if (data["distributionDate"] && data["distributionDate"].indexOf("-") != -1) {
						var m = moment(data["distributionDate"]);
						$('#distribuicaoAdd').calendar('set date', m.toDate());
					}
					
					$("#processoUnificado").mask("0000000-00.0000.0.00.0000");
					
					if (data["responsibleId"]) {
						var r = data["responsibleId"].split(",");
						for (var i=0; i<r.length; i++) {
							$('#listResponsible').dropdown('set selected', r[i]);
						}
					}
					
					$('.form-add-process').form({
						inline : true,
						on: 'blur',
						fields: {
							processoUnificado: {
						        identifier: 'processoUnificado',
						        rules: [{
						            type   : 'empty',
						            prompt : 'Informe o numero processo unificado!'
						        },{
						            type   : 'minLength[25]',
						            prompt : 'Numero processo unificado deve ter no minimo 20 numeros!'
						        }]
							},
							listResponsible: {
						        identifier: 'listResponsible',
						        rules: [{
						            type   : 'empty',
						            prompt : 'Selecione o responsavel!'
						        }, {
						            type   : 'maxCount[3]',
						            prompt : 'Voce pode selecionar no maximo 3 responsaveis!'
						        }]
							},
							pastaFisica: {
						        identifier: 'pastaFisica',
						        rules: [{
						            type   : 'maxLength[50]',
						            prompt : 'Pasta fisica deve ter no maximo 50 caracteres!'
						        }]
							}
					    }
					});	
					$(".loading").hide();
					
				}, 300);
				
			});
			
		},
		getMasterFather: function(id) {
            var o = structure[id];
            if (o["father"] == 0) {  return id;  }
            return legalprocess.getMasterFather(o["father"]);
        },
        showStructure: function(id, father) {
        	var o = structure[id];
        	var p = legalprocess.getListById(id);
        	var m = moment(p["distributionDate"]);

			var html = '<div class="ui relaxed divided list"><div class="item item-id-' + id + '"><i class="folder icon"></i><div class="content"><div class="header header-id-' + id + '">' + p["number"] + '</div><div class="description">Data Distribui&ccedil;&atilde;o:&nbsp;<b>' + m.format("DD/MM/YYYY") + '</b>&nbsp;-&nbsp;Situa&ccedil;&atilde;o:&nbsp;<b>' + p["situation"] + '</b>' + (p["justiceSecret"] ? '&nbsp;-&nbsp;(Segredo Justi&ccedil;a)' : '') + '</div><div class="list list-father-' + id + '"></div></div>';
			if (father == 0) {
				$(".modal-process-structure").find(".content").html(html);
			} else {
				$(".list-father-" + father).append(html);
			}
			
			for (var i=0; i<o["children"].length; i++) {
				legalprocess.showStructure(o["children"][i], id);
			}
			
			$(".modal-process-structure").modal("show");
        },
        
        getListById: function(id) {
            for (var i=0; i<listProcess.length; i++) {
                var row = listProcess[i];
                if (row["id"] == id) return row;
            }
            return null;
        }
		
	}
})();

var legalprocessEvents = (function(){
	var current = null;
	return {
		setup: function() {
			$.event.trigger({ type: "responsibleCreated" });
			$.event.trigger({ type: "responsibleRemove" });
			$(document).on("responsibleCreated", function (ev, data) { legalprocess.loadResponsibles(); });
			$(document).on("responsibleRemove", function (ev, data) { legalprocess.loadResponsibles(); });
			
			$(".search-process").keyup(function(ev) {
				var datatable = legalprocess.getDatatable();
				datatable.columns(+($(ev.currentTarget).data("column"))).search(this.value).draw();
			})
			$(".change-search-process").change(function(ev) {
				var value = this.value;
				if ($(ev.currentTarget).attr('type') == 'checkbox') {
					value = $(ev.currentTarget).is(':checked'); 
				}
				var datatable = legalprocess.getDatatable();
				datatable.columns(+($(ev.currentTarget).data("column"))).search(value).draw();
			})
			
			$(document).on('click', '.btn-adicionar-processo', function(ev) {
				$(".loading").show();
				var options = {
					type: 'GET',
					dataType: 'json',
					contentType : 'application/json',
					url: '/responsaveis'
		        };					
				main.request(options).then(function(list) {
					legalprocess.setResponsibles(list);
					var data = {
						"title": "Novo Processo",
						"id": "",
						"numero": "",
						"datadistribuicao": "",
						"pastafisica": "",
						"segredojustica": "",
						"descricao": "",
						"method": "POST",
						"responsibles": list,
						"process": legalprocess.getLegalProcess() 
					}
					legalprocess.showWindow(data);
					
				});
				
			});
			
			$(document).on('click', '.click-show-process-father', function(ev) {
				$(".modal-process-structure").find(".content").html("");
				var id = $(ev.currentTarget).data("id");
				var struct = legalprocess.getStructure(id);
	        	if (struct["father"] != 0) id = legalprocess.getMasterFather(id);
				legalprocess.showStructure(id, 0);
				
				$(".header-id-" + $(ev.currentTarget).data("id")).css("color", "blue");
				
			});
			$(document).on('click', '.btn-save-process', function(ev) {
				$('.form-add-process').form('validate form');
				if( $('.form-add-process').form('is valid')) {
					var dd = $("#dataDistribuicao").val();
					if (dd != "") { 
						var d = dd.split("/")
						dd = d[2] + "-" + d[1] + "-" + d[0]; 
					}
					var data = {
						"id": $("#idAddProcess").val(),
						"number": $("#processoUnificado").val(),
						"distributionDate": dd,
						"justiceSecret": $("#segredoJustica").is(":checked"),
						"physicalFolder": $("#pastaFisica").val(),
						"description": $("#descricao").val(),
						"processFather": $("#processoPai").val(),
						"situation": $("#situacao").val(),
						"responsibles": []
					}
					
					data["processFather"] = null;
					var list = legalprocess.getLegalProcess();
					if ($("#processoPai").val() != "0") {
						for (var i=0; i<list.length; i++) {
							var row = list[i];
							if (row["id"] == $("#processoPai").val()) {
								delete row["responsibleId"];
								delete row["responsibleName"];
								if (row["processFather"] == "") row["processFather"] = null;
								data["processFather"] = row;
							} 
						}
					}
					
					var r = legalprocess.getResponsibles();
					var selecteds = $("#listResponsible").val();
					for (var i=0; i<r.length; i++) {
						var row = r[i];
						for (var x=0; x<selecteds.length; x++) {
							if (selecteds[x] == row["id"]) {
								row["process"] = {};
								data["responsibles"].push(row);
							}
						}
					}
					
					console.log("save", data)
					
					$(".loading").show();
					$.ajax({
						type: "POST",
						dataType: 'json',
						contentType : 'application/json',
						data: JSON.stringify(data),
						url: '/processos',
						success: function (result) {
							$(".loading").hide();
							$('.modal-add-process').modal('hide');
							if ($("#methodAddProcess").val() == "POST") {
								util.showMessage("success", "Processo cadastrado", "O processo " + $("#processoUnificado").val() + " foi cadastrado com sucesso!")
							} else if ($("#methodAddProcess").val() == "PUT") {
								util.showMessage("success", "Processo alterado", "O processo " + $("#processoUnificado").val() + " foi alterado com sucesso!")
							}
							legalprocess.loadDatatable();
							$(document).trigger("legalProcessCreated", [data]);

						},
						error: function(response, status, error){
							$(".loading").hide();
							if (response["responseJSON"] && response["responseJSON"].error) {
								var f = $("#" + response["responseJSON"].field).parent();
								while (f.hasClass("field") == false) {
									f = $(f).parent();
								}  
								f.addClass("error");
								f.append('<div class="ui basic red pointing prompt label transition visible">' + response["responseJSON"].error + '</div>');
							} else {
								util.showMessage("error", "Erro ao criar processo", response["responseText"]);
							} 
						}
			        });					
				}
			});
			
		},
		actionsDatatable: function() {
			$(document).on('click', '.click-edit-process', function(ev) {
				var datatable = legalprocess.getDatatable();				
				var tochange = null;
				datatable.data().each( function (row) {
					if (row["id"] == $(ev.currentTarget).data("id")) {
						tochange = row;
						return;
					}
				});
				if (tochange) {
					
					tochange["title"] = "Editar processo";
					tochange["method"] = "PUT";
					tochange["segredojustica"] = (tochange["justiceSecret"] ? "checked": "");
					tochange["responsibles"] = legalprocess.getResponsibles();
					
					var p = legalprocess.getLegalProcess().slice();
					for (var i=0; i<p.length; i++) {
						var row = p[i];
						if (row["id"] == tochange["id"]) {
							p.splice(i, 1);
							i--;
						}
					}
				
					tochange["process"] = p;
					legalprocess.showWindow(tochange);
					
				}
			})
			$(document).on('click', '.click-remove-process', function(ev) {
				var datatable = legalprocess.getDatatable();				
				var toremove = null;
				datatable.data().each( function (row) {
					if (row["id"] == $(ev.currentTarget).data("id")) {
						toremove = row;
						return;
					}
				});
				if (toremove) {
					var data = {
						"title": "Eliminar processo",
						"message": "Confirmar a elimina&ccedil;&atilde;o do processo " + toremove["number"] + "?",
						"path": "processo",
						"id": toremove["id"],
						"js": "legalprocess",
						"event": "legalProcessRemove"
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
	legalprocess.start();
});