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
@Api(value = "AuditLogController", description = "�̻����� ����")
public class AuditLogController {
	
	@RequestMapping(value = "/log/list", method = RequestMethod.POST)
	public ResultVO getAuditLogList(
			 @Valid @RequestBody AuditLogListVO auditLogListVO
			) {
		
		ResultVO result = new ResultVO();
		
		try {
			result.setReturn_code(0);
			result.setMsg("�̻����� ���� ��ȸ�� �Ϸ��߽��ϴ�.");
		
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return result;
		
	}

}
