package com.softplan.juridico.core.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.softplan.juridico.core.entity.Config;

@Repository
public interface ConfigRepository extends CrudRepository<Config, Long> {
	
	public Config findByCode(String code);
	
	
	
}
