package com.smt.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.smt.service.MitreAttackService;

import io.swagger.annotations.Api;

@RestController
@RequestMapping("/mitre")
@Api(value = "MitreController", description = "ATT&CK Mitre Attack Info ����")
public class MitreController {

	@Autowired
	MitreAttackService mitreAttackService;

	@RequestMapping(value = "/read/file", method = RequestMethod.GET)
	public String readFileMitre() {
		String result = "����";
		try {
			String path = "C:\\hackertrace\\enterprise-attack.json";
			mitreAttackService.saveMitreAttackInFile(path);
		} catch (Exception e) {
			result = "����";
		}
		return result;
	}

}
