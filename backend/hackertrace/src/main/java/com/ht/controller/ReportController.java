package com.ht.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.annotations.Api;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequestMapping("/report")
@Api(value = "ReportController", description = "통계/보고서 관련")
public class ReportController {

	@CrossOrigin(origins = "*", allowedHeaders = "*")
	@RequestMapping(value = "/list", method = RequestMethod.GET)
	public String main() {
		return "test";
	}
}
