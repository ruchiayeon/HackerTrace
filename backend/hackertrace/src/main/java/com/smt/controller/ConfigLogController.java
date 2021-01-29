package com.smt.controller;

import java.util.ArrayList;
import java.util.List;

import javax.validation.Valid;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.Gson;
import com.smt.service.ConfigLogService;
import com.smt.util.APIUtil;
import com.smt.vo.ConfigLogContentsVO;
import com.smt.vo.ConfigLogHistoryVO;
import com.smt.vo.ConfigLogListVO;
import com.smt.vo.ConfigLogMessageVO;
import com.smt.vo.ConfigLogSessionsVO;
import com.smt.vo.DirectoryTopVO;
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
	
//	@ApiOperation(value = "형상 관리 원본 파일 등록 초기화(to.배)")
//	@CrossOrigin(origins = "*", allowedHeaders = "*")
//	@RequestMapping(value = "/file/origin/drop", method = RequestMethod.GET)
//	public ResultVO dropConfigOriginFile() {
//
//		try {
//				service.dropCofingOriginFile();
//				return APIUtil.resResult(0, "형상관리 원본 데이터 초기화가 완료되었습니다.", null);
//		}catch(Exception e) {
//			return APIUtil.resResult(1, "형상관리 원본 데이터 초기화에 실패되었습니다.", null);
//		}
//		
//	}

//	@ApiOperation(value = "형상 관리 원본 파일 등록(to.배)")
//	@CrossOrigin(origins = "*", allowedHeaders = "*")
//	@RequestMapping(value = "/file/origin", method = RequestMethod.POST)
//	public ResultVO insertConfigOriginFile(final @Valid @RequestBody ConfigLogVO configLogVO) {
//
//		try {
//			if(service.insertConfigOriginFile(configLogVO))
//				return APIUtil.resResult(0, "형상관리 원본 데이터 등록이 완료되었습니다.", null);
//			else
//				return APIUtil.resResult(-7, "이미 등록된 형상관리 원본 데이터 파일 명입니다.", null);
//		}catch(Exception e) {
//			return APIUtil.resResult(1, "형상관리 원본 데이터 등록이 실패되었습니다.", null);
//		}
//		
//	}
	
	@ApiOperation(value = "형상 관리 파일 로그 저장(fluentd)")
	@CrossOrigin(origins = "*", allowedHeaders = "*")
	@RequestMapping(value = "/file/log", method = RequestMethod.POST, produces = "application/json", consumes = MediaType.ALL_VALUE )
	public synchronized ResultVO insertConfigLogFile(@RequestParam("host_ip") String hostIp, @RequestBody String req){

		try {
			
			String[] messageLine = req.split("\\n");
			hostIp = hostIp.replaceAll("_", ".");
			
			for(String message : messageLine ) {
				if(message != "" || message != null ) {
					Gson gson = new Gson();
					ConfigLogMessageVO configLogMessageVO  = gson.fromJson(message.trim(), ConfigLogMessageVO.class);
					service.insertConfigLogFile(hostIp, configLogMessageVO);
				}	
			}
			
			return APIUtil.resResult(0, "형상관리 로그 데이터 등록이 완료되었습니다.", null);
		}catch(Exception e) {
			e.printStackTrace();
			return APIUtil.resResult(1, "형상관리 로그 데이터 등록이 실패되었습니다.", null);
		}
		
	}
	
	
	
	@ApiOperation(value = "하위 디렉터리 하나씩 보여줌(ex. /etc -> /a,/b, /etc/b -> /c1, /c2)")
	@CrossOrigin(origins = "*", allowedHeaders = "*")
	@RequestMapping(value = "/directory", method = RequestMethod.POST)
	public ResultVO selectConfigDirectory(final @RequestBody DirectoryTopVO directoryTopVO) {

		try {
			
			Document resultDoc = new Document();
			resultDoc.put("name", directoryTopVO.getTopDirectory());
			resultDoc.put("children", service.selectConfigFileDirectory(directoryTopVO));
			resultDoc.put("files", service.getFileNamesByFilePath(directoryTopVO));
			return APIUtil.resResult(0, "형상 관리 파일 디렉터리 목록 조회가 완료되었습니다.", resultDoc);
		}catch(Exception e) {
			e.printStackTrace();
			return APIUtil.resResult(1, "형상 관리 파일 디렉터리 목록 조회가 실패되었습니다.", null);
		}
		
	}

	@ApiOperation(value = "형상 관리 원본 파일, 로그 파일 정보 조회")
	@CrossOrigin(origins = "*", allowedHeaders = "*")
	@RequestMapping(value = "/log/list", method = RequestMethod.POST)
	public ResultVO selectConfigLogList(final @Valid @RequestBody ConfigLogListVO configLogListVO) {
		try {
			System.out.println("/log/list");
			return APIUtil.resResult(0, "형상 관리 로그 내역 조회를 완료했습니다.", service.selectConfigLogFileList(configLogListVO));
		}catch(Exception e) {
			e.printStackTrace();
			return APIUtil.resResult(1, "형상 관리 로그 내역 조회를 실패했습니다.", null);
		}
	}
	
	//수정 필요 로그  object id 받아서 처리
	@ApiOperation(value = "요청한 Obj Id 간 내용 비교")
	@CrossOrigin(origins = "*", allowedHeaders = "*")
	@RequestMapping(value = "/origin-log/contents", method = RequestMethod.POST)
	public ResultVO selectConfigOriginFileContents(final @Valid @RequestBody ConfigLogContentsVO configLogContentsVO) {
		try {
			List<Document> result = new ArrayList<Document>();
			result = service.selectConfigOriginLogFileContents(configLogContentsVO);
			return APIUtil.resResult(0, configLogContentsVO.getLogObjId()+"/"+configLogContentsVO.getLogObjId()
												+"의 원본/로그 파일 내용 조회가 완료되었습니다.", result);
		}catch(Exception e) {
			return APIUtil.resResult(1,configLogContentsVO.getLogObjId()+"/"+configLogContentsVO.getLogObjId()
												+"의 원본/로그 파일 내용 조회가 실패되었습니다.", null);
		} 
	}
	
	
	@ApiOperation(value = "형상 로그 파일 이전 감사 로그")
	@CrossOrigin(origins = "*", allowedHeaders = "*")
	@RequestMapping(value = "/audit/history", method = RequestMethod.POST)
	public ResultVO selectBeforDateAuditLogByConfigLog(final @Valid @RequestBody ConfigLogHistoryVO configLogHistoryVO) {
		
		try {
			List<Document> result = service.selectBeforDateAuditLogByConfigLog(configLogHistoryVO);
			return APIUtil.resResult(0, "형상 로그 파일 이전 감사로그 조회가 완료되었습니다.", result);
			
		}catch(Exception e) {
			return APIUtil.resResult(1, "형상 로그 파일 이전 감사로그 조회가 실패되었습니다.", null);
		}
	}
	
//	@ApiOperation(value = "형상 로그 파일 이전 감사 로그 세션 목록")
//	@CrossOrigin(origins = "*", allowedHeaders = "*")
//	@RequestMapping(value = "/log/modify/session", method = RequestMethod.POST)
//	public ResultVO selectBefroDateAuditLogSessionList(final @Valid @RequestBody ConfigLogSessionsVO configLogSessionsVO) {
//		
//		try {
//			List<Document> list = service.selectBefroDateAuditLogSessionList(configLogSessionsVO);
//			return APIUtil.resResult(0,"형상 로그 파일 이전 감사 로그 세션 목록 조회가 완료했습니다.", list );
//		}catch(Exception e) {
//			e.printStackTrace();
//			return APIUtil.resResult(1, "형상 로그 파일 이전 감사 로그 세션 목록 조회가 실패되었습니다.", null);
//		}
//		
//	}
	
	
	
}
