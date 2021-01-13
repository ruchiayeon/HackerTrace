package com.smt.controller;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.smt.service.ConfigLogService;
import com.smt.util.APIUtil;
import com.smt.vo.ConfigLogListVO;
import com.smt.vo.ConfigLogVO;
import com.smt.vo.ResultVO;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@RestController
@RequestMapping("/config")
@Api(value = "ConfigLogController", description = "형상관리 관련")
public class ConfigLogController {
	
	@Autowired
	ConfigLogService service;
	
	@ApiOperation(value = "형상 관리 원본 파일 등록 초기화")
	@RequestMapping(value = "/file/origin/drop", method = RequestMethod.GET)
	public ResultVO dropConfigOriginFile() {

		try {
				service.dropCofingOriginFile();
				return APIUtil.resResult(0, "형상관리 원본 데이터 초기화가 완료되었습니다.", null);
		}catch(Exception e) {
			return APIUtil.resResult(1, "형상관리 원본 데이터 초기화에 실패되었습니다.", null);
		}
		
	}

	@ApiOperation(value = "형상 관리 원본 파일 등록")
	@RequestMapping(value = "/file/origin", method = RequestMethod.POST)
	public ResultVO insertConfigOriginFile(final @Valid @RequestBody ConfigLogVO configLogVO) {

		try {
			if(service.insertConfigOriginFile(configLogVO))
				return APIUtil.resResult(0, "형상관리 원본 데이터 등록이 완료되었습니다.", null);
			else
				return APIUtil.resResult(-7, "이미 등록된 형상관리 원본 데이터 파일 명입니다.", null);
		}catch(Exception e) {
			return APIUtil.resResult(1, "형상관리 원본 데이터 등록이 실패되었습니다.", null);
		}
		
	}
	
	@ApiOperation(value = "형상 관리 원본 이후 파일 정보 등록")
	@RequestMapping(value = "/file/log", method = RequestMethod.POST)
	public ResultVO insertConfigLogFile(final @Valid @RequestBody ConfigLogVO configLogVO) {

		try {
			service.insertConfigLogFile(configLogVO);
			return APIUtil.resResult(0, "형상관리 로그 데이터 등록이 완료되었습니다.", null);
		}catch(Exception e) {
			return APIUtil.resResult(1, "형상관리 로그 데이터 등록이 실패되었습니다.", null);
		}
		
	}
	
	@ApiOperation(value = "형상 관리 원본 파일, 로그 파일 정보 조회")
	@RequestMapping(value = "/list", method = RequestMethod.POST)
	public ResultVO selectConfigLogList(final @Valid @RequestBody ConfigLogListVO ConfigLogListVO) {
		try {
			return APIUtil.resResult(0, "형상 관리 로그 내역 조회를 완료했습니다.", service.selectConfigLogFileList(ConfigLogListVO));
		}catch(Exception e) {
			return APIUtil.resResult(1, "형상 관리 로그 내역 조회를 실패했습니다.", null);
		}
	}
	
}
