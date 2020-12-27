package com.smt.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.smt.service.MitreAttackService;
import com.smt.vo.ResultVO;

import io.swagger.annotations.Api;

@RestController
@RequestMapping("/mitre")
@Api(value = "MitreController", description = "ATT&CK Mitre Attack ����")
public class MitreController {

	@Autowired
	MitreAttackService mitreAttackService;
	
	private String _mitreFilePath ="C:\\hackertrace\\enterprise-attack.json";

	@RequestMapping(value = "/read/file", method = RequestMethod.GET)
	public ResultVO readFileMitre() {
		ResultVO result = new ResultVO();
		try {
			mitreAttackService.saveMitreAttackInFile(_mitreFilePath);
			result.setErr_code(0);
			result.setMsg("������ ���� ���� DB ������ �Ϸ�Ǿ����ϴ�.");
		} catch (Exception e) {
			result.setErr_code(1);
			result.setMsg("������ ���� ���� DB ���忡 �����Ͽ����ϴ�.");
		}
		return result;
	}

}
