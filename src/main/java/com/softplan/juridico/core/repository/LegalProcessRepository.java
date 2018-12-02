package com.softplan.juridico.core.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.softplan.juridico.core.entity.LegalProcess;

@Repository
public interface LegalProcessRepository extends CrudRepository<LegalProcess, Long> {
	
	public LegalProcess findProcessByNumber(String number);
	public LegalProcess findProcessByProcessFather(Long id);
	
}
