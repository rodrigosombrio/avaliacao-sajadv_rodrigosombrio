package com.softplan.juridico.core.entity;

import java.io.Serializable;
import java.util.Calendar;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.NamedQueries;
import javax.persistence.NamedQuery;
import javax.persistence.OneToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.softplan.juridico.core.Situation;

@Entity
@NamedQueries({
	@NamedQuery(name = "LegalProcess.findProcessByNumber", query = "SELECT e FROM LegalProcess e WHERE number =:number"),
	@NamedQuery(name = "LegalProcess.findProcessByProcessFather", query = "SELECT e FROM LegalProcess e WHERE e.id =:id"),
})

public class LegalProcess implements Serializable {

	private static final long serialVersionUID = 1L;
	
	public LegalProcess() {}
	
	public LegalProcess(Long id, Calendar date, Boolean secret, String folder, Situation situation, String description) {
		this.setId(id);
		this.setDistributionDate(date);
		this.setJusticeSecret(secret);
		this.setPhysicalFolder(folder);
		this.setSituation(situation);
		this.setDescription(description);
		
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
	private String number;
	
	/**
	 * Data distribuição
	 */
	@Temporal(TemporalType.DATE)
	private Calendar distributionDate;	

	/**
	 * Nome.
	 */
	private Boolean justiceSecret;

	/**
	 * Email.
	 */
	private String physicalFolder;

	
	@NotNull
	@Enumerated(EnumType.STRING)
	@Column(name = "situation", nullable = false)
	private Situation situation;
	
	/**
	 * Cpf.
	 */
	@Column(columnDefinition = "TEXT")
	private String description;

	@OneToOne
	private LegalProcess processFather;

	@ManyToMany
	@JoinTable(name = "legal_process_responsible", 
		joinColumns = @JoinColumn(name = "responsible_id", referencedColumnName = "id"), 
		inverseJoinColumns = @JoinColumn(name = "process_id", referencedColumnName = "id"))
	private List<Responsible> responsibles;
	
	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getNumber() {
		return number;
	}

	public void setNumber(String number) {
		this.number = number;
	}

	@JsonFormat(pattern = "yyyy-MM-dd")
	public Calendar getDistributionDate() {
		return distributionDate;
	}

	public void setDistributionDate(Calendar distributionDate) {
		this.distributionDate = distributionDate;
	}

	public Boolean getJusticeSecret() {
		return justiceSecret;
	}

	public void setJusticeSecret(Boolean justiceSecret) {
		this.justiceSecret = justiceSecret;
	}

	public String getPhysicalFolder() {
		return physicalFolder;
	}

	public void setPhysicalFolder(String physicalFolder) {
		this.physicalFolder = physicalFolder;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public LegalProcess getProcessFather() {
		return processFather;
	}

	public void setProcessFather(LegalProcess processFather) {
		this.processFather = processFather;
	}

	public Situation getSituation() {
		return situation;
	}

	public void setSituation(Situation situation) {
		this.situation = situation;
	}

	public List<Responsible> getResponsibles() {
		return responsibles;
	}

	public void setResponsibles(List<Responsible> responsibles) {
		this.responsibles = responsibles;
	}
    
    


}