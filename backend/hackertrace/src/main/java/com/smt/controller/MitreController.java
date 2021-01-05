package com.smt.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.smt.service.MitreAttackService;
import com.smt.vo.ResultVO;

import io.swagger.annotations.Api;

@RestController
@RequestMapping("/mitre")
@Api(value = "MitreController", description = "상관분석 관련(ATT&CK Mitre Attack)")
public class MitreController {

	@Autowired
	MitreAttackService mitreAttackService;
	
	private String _mitreFilePath ="C:\\hackertrace\\enterprise-attack.json";

	@RequestMapping(value = "/read/file", method = RequestMethod.GET)
	public ResultVO readFileMitre() {
		ResultVO result = new ResultVO();
		try {
			mitreAttackService.saveMitreAttackInFile(_mitreFilePath);
			result.setReturn_code(0);
			result.setMsg("마이터 공격 정보 DB 저장이 완료되었습니다.");
		} catch (Exception e) {
			result.setReturn_code(1);
			result.setMsg(e.getMessage());
		}
		return result;
	}
	
	@RequestMapping(value="/get/matrix", method=RequestMethod.GET)
	public ResultVO getMiterMatrix(
			@RequestParam(value="isSubT", defaultValue = "F") String isSubT
	) {
		ResultVO result = new ResultVO();
		
		try {
			result.setReturn_code(0);
			result.setMsg("마이터 메트릭스 정보 조회가 완료되었습니다.");
			result.setData(mitreAttackService.selectMitreAttackIdsByKillChainPhases(isSubT));
		}catch(Exception e) {
			e.printStackTrace();
			result.setReturn_code(1);
			result.setMsg("마이터 메트릭스 정보 조회가 실패되었습니다.");
		}
	
		return result;
	}

}
