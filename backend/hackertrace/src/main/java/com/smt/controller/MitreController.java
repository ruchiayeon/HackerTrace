package com.smt.controller;

import java.util.List;

import javax.validation.Valid;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.smt.service.MitreAttackService;
import com.smt.util.APIUtil;
import com.smt.vo.MitreAuditConditionVO;
import com.smt.vo.MitreAuditVO;
import com.smt.vo.ResultVO;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@RestController
@RequestMapping("/mitre")
@Api(value = "MitreController", description = "상관 분석 관련(ATT&CK Mitre Attack)")
public class MitreController {

	@Autowired
	MitreAttackService mitreAttackService;

	private String _mitreFilePath = "C:\\hackertrace\\enterprise-attack.json";

	@RequestMapping(value = "/file/enterprise-attack", method = RequestMethod.GET)
	@ApiOperation(value = "마이터 공격 정보 파일을 DB에 저장함('enterprise-attack.json')")
	public ResultVO readFileMitre() {
		try {
			mitreAttackService.saveMitreAttackInFile(_mitreFilePath);
			return APIUtil.resResult(0, "마이터 공격 정보를 DB에 저장하였습니다.", null);
		} catch (Exception e) {
			return APIUtil.resResult(1, e.getMessage(), null);
		}
	}

	@RequestMapping(value = "/matrix", method = RequestMethod.GET)
	@ApiOperation(value = "Linux 마이터 공격 정보 메트릭스 조회")
	public ResultVO getMiterMatrix(@RequestParam(value = "isSubT", defaultValue = "F") String isSubT) {
		try {
			Document matrix = mitreAttackService.selectMitreAttackIdsByKillChainPhases(isSubT);
			return APIUtil.resResult(0, "마이터 공격 정보 조회가 완료되었습니다.", matrix);
		} catch (Exception e) {
			return APIUtil.resResult(1, e.getMessage(), null);
		}

	}
	
	@RequestMapping(value = "/condition", method = RequestMethod.POST)
	@ApiOperation(value = "기간에 해당하는 검색 조건들을 조회")
	public ResultVO getSearchCondition(@Valid @RequestBody MitreAuditConditionVO mitreAuditConditionVO) {

		try {
			Document mitreAuditCondtion = mitreAttackService.selectMitreAuditCondition(mitreAuditConditionVO);
			return APIUtil.resResult(0, "검색 조건 목록 조회가 완료되었습니다.", mitreAuditCondtion);
		} catch (Exception e) {
			e.printStackTrace();
			return APIUtil.resResult(0, "검색 조건 목록 조회가 실패되었습니다.", null);
		}
	}

	// 날짜 선택 -> 호스트 선택(ip) -> 사용자 선택(uid) -> 세션 선택(ses)
	@RequestMapping(value = "/list", method = RequestMethod.POST)
	@ApiOperation(value = "상관 분석 로그를 조회 합니다.")
	public ResultVO getMitreAuditList(@Valid @RequestBody MitreAuditVO mitreAuditVO) {

		try {
			List<Document> mitreAList = mitreAttackService.selectMitreAuditList(mitreAuditVO);
			return APIUtil.resResult(0, "상관 분석 목록 조회가 완료되었습니다.", mitreAList);
		} catch (Exception e) {
			e.printStackTrace();
			return APIUtil.resResult(0, "상관 분석 목록 조회가 실패되었습니다.", null);
		}
	}
	
	@RequestMapping(value = "/phase", method = RequestMethod.GET)
	@ApiOperation(value = "T값이 해당하는 공격 단계")
	public ResultVO getKillChainPhaseByT(@RequestParam("external_id") String externalId) {
		
		try {
			return APIUtil.resResult(0, "공격 단계 조회가 완료되었습니다.", mitreAttackService.getKillChainPhaseByT(externalId));
		} catch (Exception e) {
			return APIUtil.resResult(1, "공격 단계 조회가 실패되었습니다.", null);
		}
		
	}
	
	
}
