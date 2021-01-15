package com.smt.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.annotations.Api;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
@Api(value = "MainController", description = "테스트 API")
public class MainController {

//	@RequestMapping(value = "/index", method = RequestMethod.GET)
//	public String main() {
//		return "test";
//	}
	
}
