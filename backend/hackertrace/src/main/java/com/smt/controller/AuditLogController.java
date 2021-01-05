package com.smt.controller;

import javax.validation.Valid;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.smt.vo.AuditLogListVO;
import com.smt.vo.ResultVO;

import io.swagger.annotations.Api;

@RestController
@RequestMapping("/audit")
@Api(value = "AuditLogController", description = "이상행위 관련")
public class AuditLogController {
	
	@RequestMapping(value = "/log/list", method = RequestMethod.POST)
	public ResultVO getAuditLogList(
			 @Valid @RequestBody AuditLogListVO auditLogListVO
			) {
		
		ResultVO result = new ResultVO();
		
		try {
			result.setReturn_code(0);
			result.setMsg("이상행위 내역 조회를 완료했습니다.");
		
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return result;
		
	}

}
