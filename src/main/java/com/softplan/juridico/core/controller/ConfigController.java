package com.softplan.juridico.core.controller;

import java.util.Iterator;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;

import com.softplan.juridico.core.entity.Config;
import com.softplan.juridico.core.repository.ConfigRepository;

@Controller
public class ConfigController {
	
	@Autowired
	private ConfigRepository configRepository;
	   
	private static final Logger log = LoggerFactory.getLogger(LegalProcessController.class);
	  
	public Config findByCode(String code) {
		log.info("configrepo, {}", configRepository);
		Iterable<Config> list = configRepository.findAll();
		list.forEach(config -> {
			log.info("config, {}", config.getCode());
		});
		return configRepository.findByCode(code);
	     
	}
	  
}


