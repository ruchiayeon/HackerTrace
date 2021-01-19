package com.smt.controller;

import java.util.List;

import javax.validation.Valid;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.smt.service.ConfigLogService;
import com.smt.util.APIUtil;
import com.smt.vo.ConfigLogHistoryVO;
import com.smt.vo.ConfigLogListVO;
import com.smt.vo.ConfigLogSessionsVO;
import com.smt.vo.ConfigLogVO;
import com.smt.vo.ConfigOriginVO;
import com.smt.vo.ResultVO;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequestMapping("/config")
@Api(value = "ConfigLogController", description = "형상관리 관련")
public class ConfigLogController {
	
	@Autowired
	ConfigLogService service;
	
	@ApiOperation(value = "형상 관리 원본 파일 등록 초기화(to.배)")
	@CrossOrigin(origins = "*", allowedHeaders = "*")
	@RequestMapping(value = "/file/origin/drop", method = RequestMethod.GET)
	public ResultVO dropConfigOriginFile() {

		try {
				service.dropCofingOriginFile();
				return APIUtil.resResult(0, "형상관리 원본 데이터 초기화가 완료되었습니다.", null);
		}catch(Exception e) {
			return APIUtil.resResult(1, "형상관리 원본 데이터 초기화에 실패되었습니다.", null);
		}
		
	}

	@ApiOperation(value = "형상 관리 원본 파일 등록(to.배)")
	@CrossOrigin(origins = "*", allowedHeaders = "*")
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
	
	@ApiOperation(value = "형상 관리 원본 이후 파일 정보 등록(to.배)")
	@CrossOrigin(origins = "*", allowedHeaders = "*")
	@RequestMapping(value = "/file/log", method = RequestMethod.POST)
	public ResultVO insertConfigLogFile(final @Valid @RequestBody ConfigLogVO configLogVO) {

		try {
			service.insertConfigLogFile(configLogVO);
			return APIUtil.resResult(0, "형상관리 로그 데이터 등록이 완료되었습니다.", null);
		}catch(Exception e) {
			return APIUtil.resResult(1, "형상관리 로그 데이터 등록이 실패되었습니다.", null);
		}
		
	}
	
	@ApiOperation(value = "형상 관리 파일 디렉터리 목록")
	@CrossOrigin(origins = "*", allowedHeaders = "*")
	@RequestMapping(value = "/directory", method = RequestMethod.GET)
	public ResultVO selectConfigOriginFilePath() {

		try {
			return APIUtil.resResult(0, "형상 관리 파일 디렉터리 목록 조회가 완료되었습니다.", service.selectConfigOriginFilePath());
		}catch(Exception e) {
			return APIUtil.resResult(1, "형상 관리 파일 디렉터리 목록 조회가 실패되었습니다.", null);
		}
		
	}
	
	
	
	@ApiOperation(value = "형상 관리 원본 파일, 로그 파일 정보 조회")
	@CrossOrigin(origins = "*", allowedHeaders = "*")
	@RequestMapping(value = "/log/list", method = RequestMethod.POST)
	public ResultVO selectConfigLogList(final @Valid @RequestBody ConfigLogListVO configLogListVO) {
		try {
			return APIUtil.resResult(0, "형상 관리 로그 내역 조회를 완료했습니다.", service.selectConfigLogFileList(configLogListVO));
		}catch(Exception e) {
			return APIUtil.resResult(1, "형상 관리 로그 내역 조회를 실패했습니다.", null);
		}
	}
	
	@ApiOperation(value = "특정 파일 원본 파일, 로그 파일 내용 조회(무결성)")
	@CrossOrigin(origins = "*", allowedHeaders = "*")
	@RequestMapping(value = "/origin-log/contents", method = RequestMethod.POST)
	public ResultVO selectConfigOriginFileContents(final @Valid @RequestBody ConfigOriginVO configOriginVO) {
		try {
			Document result = new Document();
			result = service.selectConfigOriginLogFileContents(configOriginVO);
			return APIUtil.resResult(0, configOriginVO.getFileName()+"의 원본/로그 파일 내용 조회가 완료되었습니다.", result);
		}catch(Exception e) {
			return APIUtil.resResult(1, configOriginVO.getFileName()+"의 원본/로그 파일 내용 조회가 실패되었습니다.", null);
		}
	}
	
	@ApiOperation(value = "형상 로그 파일 이전 감사 로그 세션 목록")
	@CrossOrigin(origins = "*", allowedHeaders = "*")
	@RequestMapping(value = "/log/modify/session", method = RequestMethod.POST)
	public ResultVO selectBefroDateAuditLogSessionList(final @Valid @RequestBody ConfigLogSessionsVO configLogSessionsVO) {
		
		try {
			List<Document> list = service.selectBefroDateAuditLogSessionList(configLogSessionsVO);
			return APIUtil.resResult(0,"형상 로그 파일 이전 감사 로그 세션 목록 조회가 완료했습니다.", list );
		}catch(Exception e) {
			e.printStackTrace();
			return APIUtil.resResult(1, "형상 로그 파일 이전 감사 로그 세션 목록 조회가 실패되었습니다.", null);
		}
		
	}
	
	
	@ApiOperation(value = "형상 로그 파일 이전 감사 로그")
	@CrossOrigin(origins = "*", allowedHeaders = "*")
	@RequestMapping(value = "/log/modify/history", method = RequestMethod.POST)
	public ResultVO selectBeforDateAuditLogByConfigLog(final @Valid @RequestBody ConfigLogHistoryVO configLogHistoryVO) {
		
		try {
			List<Document> result = service.selectBeforDateAuditLogByConfigLog(configLogHistoryVO);
			return APIUtil.resResult(0, "형상 로그 파일 이전 감사로그 조회가 완료되었습니다.", result);
			
		}catch(Exception e) {
			return APIUtil.resResult(1, "형상 로그 파일 이전 감사로그 조회가 실패되었습니다.", null);
		}
	}
	
}
