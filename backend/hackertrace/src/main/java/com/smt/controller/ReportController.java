package com.smt.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.annotations.Api;

@RestController
@RequestMapping("/report")
@Api(value = "ReportController", description = "���/���� ����")
public class ReportController {

	@RequestMapping(value = "/list", method = RequestMethod.GET)
	public String main() {
		return "test";
	}
}
