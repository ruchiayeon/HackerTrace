package com.smt.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.validation.Valid;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.smt.service.HostsService;
import com.smt.util.APIUtil;
import com.smt.vo.HostsVO;
import com.smt.vo.ResultVO;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequestMapping("/host")
@Api(value = "HostsController", description = "호스트정보등록관련")
public class HostsController {

	@Autowired
	HostsService service;

	@ApiOperation(value = "설정 파일(application.properties)에서 호스트 목록을 조회합니다.")
	@CrossOrigin(origins = "*", allowedHeaders = "*")
	@RequestMapping(value = "/list", method = RequestMethod.GET)
	public ResultVO getHostsList() {
		try {
			 List<Map<String,String>> hostsList = new ArrayList<>();
			hostsList = service.getAllSavedHostsList();
			return APIUtil.resResult(0, "등록된 호스트 목록 조회가 완료되었습니다.", hostsList);
		} catch (Exception e) {
			return APIUtil.resResult(1, "등록된 호스트 목록 조회가 실패되었습니다.", null);
		}
	}
	
	@ApiOperation(value = "설정 파일(application.properties)에서 사용자와 맵핑된 관리 host를 조회합니다.")
	@CrossOrigin(origins = "*", allowedHeaders = "*")
	@RequestMapping(value = "/list/user", method = RequestMethod.POST)
	public ResultVO getHostsListByUserId(final @RequestParam("adminUserId") String userId) {
		try {
			List<Document> hostsList = new ArrayList<>();
			hostsList = service.getHostsListByUserId(userId);
			return APIUtil.resResult(0, "등록된 호스트 목록 조회가 완료되었습니다.", hostsList);
		} catch (Exception e) {
			return APIUtil.resResult(1, "등록된 호스트 목록 조회가 실패되었습니다.", null);
		}
	}
	
	

}
