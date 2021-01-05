package com.smt.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.annotations.Api;

@RestController
@RequestMapping("/dashboard")
@Api(value = "DashboardController", description = "대시보드 관련")
public class DashboardController {

	@RequestMapping(value = "/list", method = RequestMethod.GET)
	public String main() {
		return "test";
	}
}
