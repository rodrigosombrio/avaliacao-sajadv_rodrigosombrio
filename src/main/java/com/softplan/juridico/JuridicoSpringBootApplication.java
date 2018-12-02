package com.softplan.juridico;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import com.softplan.juridico.core.entity.Config;
import com.softplan.juridico.core.entity.Menu;
import com.softplan.juridico.core.repository.ConfigRepository;
import com.softplan.juridico.core.repository.MenuRepository;

@SpringBootApplication
public class JuridicoSpringBootApplication {

	public static void main(String[] args) {
		SpringApplication.run(JuridicoSpringBootApplication.class, args);
	}
	
	@Bean
    public CommandLineRunner menuData(MenuRepository repo) {
		Iterable<Menu> m = repo.findAll();
		if (m.iterator().hasNext()) {
	        return args -> { };
		} else {
	        return args -> { 
	            repo.save(new Menu("processo", "Processos", "js/legalprocess.js", 1));
	            repo.save(new Menu("responsavel", "Responsáveis", "js/responsible.js", 2));
	        };
		}
    }
	
	@Bean
    public CommandLineRunner configData(ConfigRepository repo) {
		Iterable<Config> m = repo.findAll();
		if (m.iterator().hasNext()) {
	        return args -> { };
		} else {
	        return args -> { 
	            repo.save(new Config("mail.host", "smtp.gmail.com", "Servidor SMTP de E-mail"));
	            repo.save(new Config("mail.port", "587", "Porta SMTP do servidor de E-mail"));
	            repo.save(new Config("mail.username", "avaliacao.softplan@gmail.com", "Email que sera usado para envio"));
	            repo.save(new Config("mail.password", "Softplan@123", "Senha do e-mail usado"));
	            repo.save(new Config("mail.smtp.auth", "true", "Precisa de autenticação?"));
	            repo.save(new Config("mail.smtp.starttls.enable", "true", "Usar o TLS ao iniciar?"));
	            
	        };
		}
    }	
	
}
