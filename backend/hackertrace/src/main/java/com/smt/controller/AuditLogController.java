package com.smt.controller;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.smt.service.AuditLogService;
import com.smt.vo.AuditLogListVO;
import com.smt.vo.ResultVO;

import io.swagger.annotations.Api;

@RestController
@RequestMapping("/audit-daemon")
@Api(value = "AuditLogController", description = "이상행위 로그 관련")
public class AuditLogController {

	@Autowired
	AuditLogService service;
	
	@RequestMapping(value = "/import", method = RequestMethod.GET)
	public ResultVO importAuditLog() {

		ResultVO result = new ResultVO();

		try {

			String auditLogPath = "C:\\Users\\ji\\Desktop\\HITT\\audit.log";
			service.insertAuditLogByLogFile(auditLogPath);

			result.setReturn_code(0);
			result.setMsg("audit log import과 완료되었습니다.");
			result.setData("");
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		return result;
	}

	@RequestMapping(value = "/log/list", method = RequestMethod.POST)
	public ResultVO getAuditLogList(@Valid @RequestBody AuditLogListVO auditLogListVO) {

		ResultVO result = new ResultVO();

		try {
			result.setReturn_code(0);
			result.setMsg("조회가 완료되었습니다.");
			result.setData(service.getAuditLogList(auditLogListVO));
		} catch (Exception e) {
			e.printStackTrace();
		}

		return result;

	}

}
