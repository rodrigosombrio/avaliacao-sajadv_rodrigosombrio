package com.softplan.juridico.core.mail;

import java.util.Properties;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import com.softplan.juridico.core.repository.ConfigRepository;

public class SendMail {

	private String username = null;
	private String password = null;

	private Session session = null;

	public SendMail(ConfigRepository configRepository) {
		
		username = configRepository.findByCode("mail.username").getValue();
		password = configRepository.findByCode("mail.password").getValue();
		
		Properties props = new Properties();
		props.put("mail.smtp.auth", configRepository.findByCode("mail.smtp.auth").getValue());
		props.put("mail.smtp.starttls.enable", configRepository.findByCode("mail.smtp.starttls.enable").getValue());
		props.put("mail.smtp.host", configRepository.findByCode("mail.host").getValue());
		props.put("mail.smtp.port", configRepository.findByCode("mail.port").getValue());

		session = Session.getInstance(props, new javax.mail.Authenticator() {
			protected PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication(username, password);
			}
		});
	}

	public void send(String to, String subject, String body) {
		try {

			Message message = new MimeMessage(session);
			message.setFrom(new InternetAddress(username));
			message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(to));
			message.setSubject(subject);
			message.setContent(body, "text/html; charset=utf-8");
			message.saveChanges();
			
			Transport.send(message);

		} catch (MessagingException e) {
			throw new RuntimeException(e);
		}
	}

}
