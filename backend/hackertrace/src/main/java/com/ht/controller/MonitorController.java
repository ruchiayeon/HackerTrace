package com.ht.controller;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.ht.service.MonitorService;
import com.ht.util.APIUtil;
import com.ht.vo.MonitorLogListVO;
import com.ht.vo.ResultVO;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequestMapping("/monitor")
@Api(value = "MonitorController", description = "모니터링관련")
public class MonitorController {

	
	@Autowired
	MonitorService service;
	
	@ApiOperation(value = "audit 이상행위 로그를 조회함")
	@CrossOrigin(origins = "*", allowedHeaders = "*")
	@RequestMapping(value = "/log/list", method = RequestMethod.POST)
	public ResultVO getHostMonitorList(final @Valid @RequestBody MonitorLogListVO monitorLogListVO) {
		try {
			System.out.println(monitorLogListVO.toString());
			return APIUtil.resResult(0, "조회가 완료되었습니다.", service.getHostMonitorList(monitorLogListVO));
		} catch (Exception e) {
			return APIUtil.resResult(1, "조회가 실패되었습니다.", null);
		}
	}
	
}
