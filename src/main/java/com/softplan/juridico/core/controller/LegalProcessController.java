package com.softplan.juridico.core.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.softplan.juridico.core.entity.LegalProcess;
import com.softplan.juridico.core.entity.Responsible;
import com.softplan.juridico.core.mail.SendMail;
import com.softplan.juridico.core.repository.ConfigRepository;
import com.softplan.juridico.core.repository.LegalProcessRepository;

import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Controller
@RestController
public class LegalProcessController {
	  @Autowired
	  private LegalProcessRepository processRepository;
	  
	  @Autowired
	  private ConfigRepository configRepository;
	  
	  private static final Logger log = LoggerFactory.getLogger(LegalProcessController.class);
	  
	  private int counter = 0;
	  private Boolean recursive = false;
	   
	  @GetMapping("/processos")
	  public @ResponseBody Iterable<LegalProcess> listar() {
	    return processRepository.findAll();
	     
	  }
	  
	  @PostMapping("/processos")
	  public  @ResponseBody ResponseEntity<String> create(@RequestBody LegalProcess newProcess) {
		  log.info("newProcess");
		  JSONObject result = new JSONObject();
		  LegalProcess p = processRepository.findProcessByNumber(newProcess.getNumber());
		  
		  HttpHeaders headers = new HttpHeaders();
		  headers.add("Content-Type", "application/json; charset=utf-8");

		  if (p != null && newProcess.getId() != p.getId()) {
			  log.info("newProcess: {}: {}", newProcess.getId(), p.getId());
			  result.put("error", "Número do processo informado já está cadastrado");
			  result.put("field", "processoUnificado");
			  return new ResponseEntity<String>(result.toString(), headers, HttpStatus.INTERNAL_SERVER_ERROR);
		  }
		  
		  if (newProcess.getProcessFather() != null) {
			  counter = 0;
			  recursive = false;
			  this.counter(newProcess.getProcessFather().getId(), newProcess.getId());
			  if (counter >= 4) {
				  result.put("error", "Número do processo vinculado passou o limite de 4 niveis na estrutura!");
				  result.put("field", "processoPai");
				  return new ResponseEntity<String>(result.toString(), headers, HttpStatus.INTERNAL_SERVER_ERROR);
			  } else if (recursive) {
				  result.put("error", "Número do processo vinculado já está vinculado a outro processo pai na mesma estrutura!");
				  result.put("field", "processoPai");
				  return new ResponseEntity<String>(result.toString(), headers, HttpStatus.INTERNAL_SERVER_ERROR);
			  }
		  }
		  
		  result.put("content", processRepository.save(newProcess));
		  
		  SendMail mail = new SendMail(configRepository);
		  for (Responsible r : newProcess.getResponsibles()) {
			  mail.send(r.getEmail(), "Novo processo vinculado", "Você foi cadastrado como envolvido no processo de número <b>" + newProcess.getNumber() + "</b>");
		  }
		  
		  return new ResponseEntity<String>(result.toString(), headers, HttpStatus.OK);
	  }
	  
	  @DeleteMapping("/processo/{id}")
	  public void deleteResponsible(@PathVariable Long id) {
		  LegalProcess p = processRepository.findById(id).get();
		  SendMail mail = new SendMail(configRepository);
		  for (Responsible r : p.getResponsibles()) {
			  mail.send(r.getEmail(), "Processo vinculado removido", "O processo de número <b>" + p.getNumber() + "</b> foi removido!");
		  }
		  processRepository.deleteById(id);
	  }
	  
	  private void counter(Long id, Long parent) {
		  this.counter++;
		  LegalProcess f = processRepository.findProcessByProcessFather(id);
		  if (f != null && f.getProcessFather() != null) {
			  log.info("counter: {}: {}: {}: {}: {}", counter, f.getId(), f.getNumber(), f.getProcessFather().getId(), parent);
			  if (f.getProcessFather().getId() != parent) { 
				  if (this.counter <= 4 ) { 
					  this.counter(f.getProcessFather().getId(), parent); 
				  }
			  } else recursive = true;
		  } 
		  
	  }

}


