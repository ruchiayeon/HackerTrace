package com.smt.controller;

import javax.validation.Valid;
import javax.validation.constraints.Pattern;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.smt.service.DashboardService;
import com.smt.util.APIUtil;
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
	@RequestMapping(value = "/statics/mitre-attack", method = RequestMethod.POST)
	public ResultVO countMitreAttackByAuditLog(
			@Valid @RequestParam("hostIp") 
			@Pattern(regexp = "^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$",
					   message = "올바른 IP 형식이 아닙니다.")
			String hostIp
			) 
	{
		
		try {
			return APIUtil.resResult(0, "마이터 공경정보 통계 조회가 완료되었습니다.", service.countMitreAttackByAuditLog(hostIp));
		}catch(Exception e) {
			return APIUtil.resResult(1, "마이터 공격정보 통계 조회가 실패되었습니다.", null);
		}
		
	}
}
