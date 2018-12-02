package com.softplan.juridico.controller;

import static org.junit.Assert.assertEquals;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.json.JSONObject;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.skyscreamer.jsonassert.JSONAssert;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.RequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import com.softplan.juridico.core.controller.LegalProcessController;
import com.softplan.juridico.core.entity.LegalProcess;

@RunWith(SpringRunner.class)
@WebMvcTest(value = LegalProcessController.class, secure = false)
@ContextConfiguration(classes = {LegalProcessController.class} )
public class LegalProcessControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@MockBean
	private LegalProcessController legalProcessController;

	List<LegalProcess> mockLegalProcess = new ArrayList<LegalProcess>();

	String exampleJson = "{\"name\":\"Test\",\"cpf\":\"123.456.789-00\",\"email\":\"test@softplan.com\",\"photo\":\"\", \"process\":\"\"}";

	@Test
	public void listLegalProcess() throws Exception {

		mockLegalProcess.add(new LegalProcess(1L, new Date(2018,11,01), false, "folderTeste", "situationTest", "descriptionTest"));
		
		Mockito.when(legalProcessController.listar()).thenReturn(mockLegalProcess);

		RequestBuilder requestBuilder = MockMvcRequestBuilders.get("/processos").accept(MediaType.APPLICATION_JSON);

		MvcResult result = mockMvc.perform(requestBuilder).andReturn();

		System.out.println(result.getResponse());
		String expected = "[{\"id\":1,\"number\":null,\"distributionDate\":\"3918-12-01T02:00:00.000+0000\",\"justiceSecret\":false,\"physicalFolder\":\"folderTeste\",\"situation\":\"situationTest\",\"description\":\"descriptionTest\",\"processFather\":null,\"responsibles\":null}]";

		JSONAssert.assertEquals(expected, result.getResponse().getContentAsString(), false);
	}
	
	@Test
	public void create() throws Exception {
		JSONObject json = new JSONObject();
		json.put("content", new LegalProcess(1L, new Date(2018,11,01), false, "folderTeste", "situationTest", "descriptionTest").toString());
		ResponseEntity<String> mockLegalProcess = new ResponseEntity<String>(json.toString(), HttpStatus.OK) ;

		Mockito.when(legalProcessController.create(Mockito.any(LegalProcess.class))).thenReturn(mockLegalProcess);

		RequestBuilder requestBuilder = MockMvcRequestBuilders.post("/processos").accept(MediaType.APPLICATION_JSON).characterEncoding("utf-8").contentType(MediaType.APPLICATION_JSON).content(exampleJson);

		MvcResult result = mockMvc.perform(requestBuilder).andReturn();

		MockHttpServletResponse response = result.getResponse();

		assertEquals(HttpStatus.OK.value(), response.getStatus());

	}	

	@Test
	public void delete() throws Exception {
		RequestBuilder requestBuilder = MockMvcRequestBuilders.delete("/processo/{id}", "11").accept(MediaType.APPLICATION_JSON).characterEncoding("utf-8").contentType(MediaType.APPLICATION_JSON);

		MvcResult result = mockMvc.perform(requestBuilder).andReturn();

		MockHttpServletResponse response = result.getResponse();

		assertEquals(HttpStatus.OK.value(), response.getStatus());

	}	

}
