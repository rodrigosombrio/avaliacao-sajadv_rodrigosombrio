package com.softplan.juridico.core.controller;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.Base64Utils;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.softplan.juridico.core.entity.Responsible;
import com.softplan.juridico.core.mail.SendMail;
import com.softplan.juridico.core.repository.ResponsibleRepository;

@Controller
@RestController
public class ResponsibleController {
	  @Autowired
	  private ResponsibleRepository responsibleRepository;
	   
	  private static final Logger log = LoggerFactory.getLogger(LegalProcessController.class);
	  
	  @GetMapping("/responsaveis")
	  public @ResponseBody Iterable<Responsible> listar() {
		  return responsibleRepository.findAll();
	     
	  }
	  
	  @Transactional
	  @PostMapping("/responsavel")
	  public @ResponseBody ResponseEntity<String> create(@RequestBody Responsible newResponsible) {
		  JSONObject result = new JSONObject();
		  Responsible responsible = responsibleRepository.findByCpf(newResponsible.getCpf());
		  
		  HttpHeaders headers = new HttpHeaders();
		  headers.add("Content-Type", "application/json; charset=utf-8");
		    
		  if (responsible != null && newResponsible.getId() != null && newResponsible.getId() != responsible.getId()) {
			  result.put("error", "Já existe um responsável cadastrado com esse CPF!");
			  result.put("field", "cpfAdd");
			  return new ResponseEntity<String>(result.toString(), headers, HttpStatus.INTERNAL_SERVER_ERROR);
		  }
		  
		  result.put("content", responsibleRepository.save(newResponsible));
		  return new ResponseEntity<String>(result.toString(), headers, HttpStatus.OK);
	  }
	  
	  @DeleteMapping("/responsavel/{id}")
	  public void deleteResponsible(@PathVariable Long id) {
		  responsibleRepository.deleteById(id);
	  }
	  
	  @RequestMapping(value = "/upload", method = RequestMethod.POST, consumes = "multipart/form-data")
	  public @ResponseBody String upload(@RequestParam("userAvatar") MultipartFile uploadfile) {
		  try {
			  String encoded = Base64Utils.encodeToString(uploadfile.getBytes());
			  return encoded;
		  } catch (Exception e) {
			  return null;
		  }
	  } 
}


