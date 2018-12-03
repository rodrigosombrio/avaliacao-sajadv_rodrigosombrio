package com.softplan.juridico.core;

public enum Situation {

	Em_Andamento("Em andamento", false), Desmembrado("Desmembrado", false), Em_Recurso("Em recurso", false), Finalizado("Finalizado", true), Arquivado("Arquivado", true);

	private String description;	
	private Boolean finish;	
	
	private Situation(String descricao, Boolean finalizado) {
		this.description = descricao;
		this.finish = finalizado;
	}
	
	public static Situation getSituation(String description) {
		for (Situation dt : Situation.values()) {
			if (dt.description.equalsIgnoreCase(description)) {
				return dt;
			}
		}
		return null;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Boolean getFinish() {
		return finish;
	}

	public void setFinish(Boolean finish) {
		this.finish = finish;
	}
	
	
	
	
}
