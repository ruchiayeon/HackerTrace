package com.smt.controller;

import javax.validation.Valid;
import javax.validation.constraints.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.smt.service.DashboardService;
import com.smt.util.APIUtil;
import com.smt.vo.HostsIpVO;
import com.smt.vo.ResultVO;

import io.swagger.annotations.Api;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequestMapping("/dashboard")
@Api(value = "DashboardController", description = "대시보드 관련")
public class DashboardController {

	@Autowired
	DashboardService service;

	@CrossOrigin(origins = "*", allowedHeaders = "*")
	@RequestMapping(value = "/statics/config", method = RequestMethod.POST)
	public ResultVO countConfigInfo(@Valid @RequestBody HostsIpVO hostIpVO) {
		try {
			return APIUtil.resResult(0, "형상 관리 통계 조회가 완료되었습니다.", service.getConfigModifyCount(hostIpVO.getHostIp()));
		} catch (Exception e) {
			return APIUtil.resResult(1, "형상 관리 통계 조회가 실패되었습니다.", null);
		}

	}

	@CrossOrigin(origins = "*", allowedHeaders = "*")
	@RequestMapping(value = "/statics/chart/config", method = RequestMethod.POST)
	public ResultVO countConfigInfoChart(@Valid @RequestBody HostsIpVO hostIpVO) {
		try {
			return APIUtil.resResult(0, "형상 관리 통계 조회가 완료되었습니다.",service.getConfigModifyCountWeek(hostIpVO.getHostIp()));
		} catch (Exception e) {
			return APIUtil.resResult(1, "형상 관리 통계 조회가 실패되었습니다.", null);
		}

	}

	@CrossOrigin(origins = "*", allowedHeaders = "*")
	@RequestMapping(value = "/statics/mitre-attack", method = RequestMethod.POST)
	public ResultVO countMitreAttackByAuditLog(@Valid @RequestBody HostsIpVO hostIpVO) {

		try {
			return APIUtil.resResult(0, "마이터 공격정보 통계 조회가 완료되었습니다.",service.getMitreAttackCountInfo(hostIpVO.getHostIp()));
		} catch (Exception e) {
			return APIUtil.resResult(1, "마이터 공격정보 통계 조회가 실패되었습니다.", null);
		}

	}

}
