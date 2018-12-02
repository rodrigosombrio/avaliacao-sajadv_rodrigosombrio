package com.softplan.juridico.core.entity;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Menu implements Serializable {

	private static final long serialVersionUID = 1L;
	
	public Menu() {}
	
	public Menu(String code, String label, String js, int sequence) {
		this.code = code;
		this.label = label;
		this.jsController = js;
		this.sequence = sequence;
	}
	
	/**
	 * Identificador unico da entidade.
	 */
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	/**
	 * Numero do processo unificado
	 */
	@Column(name = "code", nullable = false, unique = true, length=25)
	private String code;
	
	@Column(name = "label", nullable = false, unique = true, length=40)
	private String label;
	
	private Integer sequence;
	/**
	 * Data distribuição
	 */
	private String jsController;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getLabel() {
		return label;
	}

	public void setLabel(String label) {
		this.label = label;
	}

	public String getJsController() {
		return jsController;
	}

	public void setJsController(String jsController) {
		this.jsController = jsController;
	}

	public int getSequence() {
		return sequence;
	}

	public void setSequence(int sequence) {
		this.sequence = sequence;
	}
	
	

}