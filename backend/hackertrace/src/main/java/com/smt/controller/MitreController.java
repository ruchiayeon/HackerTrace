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
@Api(value = "MitreController", description = "ATT&CK Mitre Attack 관련")
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
			result.setMsg("마이터 공격 정보 DB 저장이 완료되었습니다.");
		} catch (Exception e) {
			result.setErr_code(1);
			result.setMsg("마이터 공격 정보 DB 저장에 실패하였습니다.");
		}
		return result;
	}

}
