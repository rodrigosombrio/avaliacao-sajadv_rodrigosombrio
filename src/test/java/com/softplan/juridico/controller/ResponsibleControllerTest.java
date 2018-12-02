package com.softplan.juridico.controller;

import static org.junit.Assert.assertEquals;

import java.util.ArrayList;
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
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.RequestBuilder;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;

import com.softplan.juridico.core.controller.ResponsibleController;
import com.softplan.juridico.core.entity.Responsible;

@RunWith(SpringRunner.class)
@WebMvcTest(value = ResponsibleController.class, secure = false)
public class ResponsibleControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@MockBean
	private ResponsibleController responsibleController;

	List<Responsible> mockResponsible = new ArrayList<Responsible>();

	String exampleJson = "{\"name\":\"Test\",\"cpf\":\"123.456.789-00\",\"email\":\"test@softplan.com\",\"photo\":\"\", \"process\":\"\"}";

	@Test
	public void listResponsible() throws Exception {

		mockResponsible.add(new Responsible(1L, "123.456.789-00", "Test", "test@softplan.com", ""));
		
		Mockito.when(responsibleController.listar()).thenReturn(mockResponsible);

		RequestBuilder requestBuilder = MockMvcRequestBuilders.get("/responsaveis").accept(MediaType.APPLICATION_JSON);

		MvcResult result = mockMvc.perform(requestBuilder).andReturn();

		System.out.println(result.getResponse());
		String expected = "[{\"id\":1,\"name\":\"Test\",\"cpf\":\"123.456.789-00\",\"email\":\"test@softplan.com\",\"photo\":\"\"}]";

		JSONAssert.assertEquals(expected, result.getResponse().getContentAsString(), false);
	}
	
	@Test
	public void create() throws Exception {
		JSONObject json = new JSONObject();
		json.put("content", new Responsible(1L, "123.456.789-00", "Test", "test@softplan.com", "").toString());
		ResponseEntity<String> mockResponsible = new ResponseEntity<String>(json.toString(), HttpStatus.OK) ;

		Mockito.when(responsibleController.create(Mockito.any(Responsible.class))).thenReturn(mockResponsible);

		RequestBuilder requestBuilder = MockMvcRequestBuilders.post("/responsavel").accept(MediaType.APPLICATION_JSON).characterEncoding("utf-8").contentType(MediaType.APPLICATION_JSON).content(exampleJson);

		MvcResult result = mockMvc.perform(requestBuilder).andReturn();

		MockHttpServletResponse response = result.getResponse();

		assertEquals(HttpStatus.OK.value(), response.getStatus());

	}	

	@Test
	public void delete() throws Exception {
		RequestBuilder requestBuilder = MockMvcRequestBuilders.delete("/responsavel/{id}", "11").accept(MediaType.APPLICATION_JSON).characterEncoding("utf-8").contentType(MediaType.APPLICATION_JSON);

		MvcResult result = mockMvc.perform(requestBuilder).andReturn();

		MockHttpServletResponse response = result.getResponse();

		assertEquals(HttpStatus.OK.value(), response.getStatus());

	}	

}
