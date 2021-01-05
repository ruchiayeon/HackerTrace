package com.smt.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.annotations.Api;

@RestController
@RequestMapping("/config")
@Api(value = "ConfigurationController", description = "형상 관리 관련")
public class ConfigurationController {

	@RequestMapping(value = "/list", method = RequestMethod.GET)
	public String main() {
		return "test";
	}
	
}
