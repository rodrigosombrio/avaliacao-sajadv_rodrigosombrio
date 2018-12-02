package com.softplan.juridico.core.repository;

import org.springframework.data.repository.CrudRepository;

import com.softplan.juridico.core.entity.Menu;
import org.springframework.data.domain.Sort;

public interface MenuRepository extends CrudRepository<Menu, Long> {
	
	public Menu findByCode(String code);
	
	public Iterable<Menu > findAll(Sort sort);  
	
	
}
