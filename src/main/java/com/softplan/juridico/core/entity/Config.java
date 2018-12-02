package com.softplan.juridico.core.entity;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Config implements Serializable {

	private static final long serialVersionUID = 1L;
	
	public Config() { }
	
	public Config(String code, String value, String detail) { 
		this.code = code;
		this.value = value;
		this.detail = detail;
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
	
	/**
	 * Data distribuição
	 */
	@Column(name = "value", length=40)
	private String value;	

	/**
	 * Data distribuição
	 */
	private String detail;

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

	public String getValue() {
		return value;
	}

	public void setValue(String value) {
		this.value = value;
	}

	public String getDetail() {
		return detail;
	}

	public void setDetail(String detail) {
		this.detail = detail;
	}
	
}