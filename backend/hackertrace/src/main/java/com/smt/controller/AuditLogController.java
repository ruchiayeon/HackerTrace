package com.smt.controller;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.smt.service.AuditLogService;
import com.smt.util.APIUtil;
import com.smt.vo.AuditLogListVO;
import com.smt.vo.ResultVO;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequestMapping("/audit-daemon")
@Api(value = "AuditLogController", description = "이상행위 로그 관련")
public class AuditLogController {

	@Autowired
	AuditLogService service;
	
//	@ApiOperation(value = "로그파일에서 audit 로그를 DB에 저장함")
//	@CrossOrigin(origins = "*", allowedHeaders = "*")
//	@RequestMapping(value = "/log/file", method = RequestMethod.GET)
//	public ResultVO importAuditLog() {
//
//		try {
//
//			String auditLogPath = "C:\\Users\\ji\\Desktop\\HITT\\audit.log";
//			service.insertAuditLogByLogFile(auditLogPath);
//
//			return APIUtil.resResult(0, "audit log import과 완료되었습니다.", null);
//			
//		} catch (Exception e) {
//			return APIUtil.resResult(1, "audit log import과 실패되었습니다.", null);
//		}
//		
//	}
	
//	@ApiOperation(value = "로그 전송 클라이언트에서 audit 로그를 DB에 저장함(for.차장님)")
//	@CrossOrigin(origins = "*", allowedHeaders = "*")
//	@RequestMapping(value = "/log/line", method = RequestMethod.GET)
//	public ResultVO insertAuditLogByLogCollector(@RequestParam("line") String log) 
//	{
//
//		try {
//
//			service.insertAuditLogByReqLog(log);
//
//			return APIUtil.resResult(0, "로그 전송 클라이언트에서 준 로그가 저장이 완료되었습니다.", null);
//			
//		} catch (Exception e) {
//			e.printStackTrace();
//			return APIUtil.resResult(1, "로그 전송 클라이언트에서 준 로그가 저장이 실패되었습니다.", null);
//		}
//		
//	}


	@ApiOperation(value = "audit 이상행위 로그를 조회함")
	@CrossOrigin(origins = "*", allowedHeaders = "*")
	@RequestMapping(value = "/log/list", method = RequestMethod.POST)
	public ResultVO getAuditLogList(final @Valid @RequestBody AuditLogListVO auditLogListVO) {
		try {
			System.out.println(auditLogListVO.toString());
			return APIUtil.resResult(0, "조회가 완료되었습니다.", service.getAuditLogList(auditLogListVO));
		} catch (Exception e) {
			return APIUtil.resResult(1, "조회가 실패되었습니다.", null);
		}
	}

}
