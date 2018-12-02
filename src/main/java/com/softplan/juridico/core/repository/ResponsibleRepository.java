package com.softplan.juridico.core.repository;

import org.springframework.data.repository.CrudRepository;

import com.softplan.juridico.core.entity.Responsible;

public interface ResponsibleRepository extends CrudRepository<Responsible, Long> {
	
	public Responsible findByCpf(String cpf);
	
	
}
