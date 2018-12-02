package com.softplan.juridico.core.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.softplan.juridico.core.entity.Menu;
import com.softplan.juridico.core.repository.MenuRepository;

@Controller
@RestController
public class MenuController {
	
	  @Autowired
	  private MenuRepository menuRepository;
	   
	  private static final Logger log = LoggerFactory.getLogger(MenuController.class);
	  
	  @GetMapping("/menu")
	  public @ResponseBody Iterable<Menu> listar() {
		  return menuRepository.findAll(new Sort(Sort.Direction.ASC, "sequence"));
	     
	  }
	  
}


