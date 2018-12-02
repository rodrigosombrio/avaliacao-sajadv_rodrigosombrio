package com.softplan.juridico.core.entity;

import java.io.Serializable;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@NamedQueries({
	@NamedQuery(name = "Responsible.findByCpf", query = "SELECT e FROM Responsible e WHERE cpf =:cpf") 
})
@JsonIgnoreProperties(value = { "process" })
public class Responsible implements Serializable {

	private static final long serialVersionUID = 1L;

	/**
	 * Identificador único da entidade.
	 */
	
	public Responsible() {}
	
	public Responsible(Long id, String cpf, String name, String email, String photo) {
		this.setId(id);
		this.setCpf(cpf);
		this.setEmail(email);
		this.setName(name);
		this.setPhoto(photo);
	}
	
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	/**
	 * Nome do responsavel
	 */
	private String name;
	
	/**
	 * CPF
	 */
	@Column(name = "cpf", nullable = false, unique = true, length=14)
	private String cpf;	

	/**
	 * Email.
	 */
	private String email;

	/**
	 * Foto.
	 */
	@Column(columnDefinition = "LONGTEXT")
	private String photo;
	
	@ManyToMany
	private List<LegalProcess> process;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getCpf() {
		return cpf;
	}

	public void setCpf(String cpf) {
		this.cpf = cpf;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPhoto() {
		return photo;
	}

	public void setPhoto(String photo) {
		this.photo = photo;
	}

	public List<LegalProcess> getProcess() {
		return process;
	}

	public void setProcess(List<LegalProcess> process) {
		this.process = process;
	}
	
	@Override
	public String toString() {
		return "{\"id\":" + this.getId() + ",\"name\":\"" + this.getName() + "\",\"email\":\"" + this.getEmail() + "\",\"photo\":\"\"}";
	}
}