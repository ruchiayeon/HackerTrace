package com.smt.controller;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.smt.service.HostsService;
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

	@ApiOperation(value = "호스트 정보를 저장함")
	@CrossOrigin(origins = "*", allowedHeaders = "*")
	@RequestMapping(value = "/save", method = RequestMethod.POST)
	public ResultVO saveHostsInfo(final @Valid @RequestBody HostsVO hostVO) {
		return service.insertHosts(hostVO);
	}

	@ApiOperation(value = "DB에 저장된 호스트 목록을 조회합니다.")
	@CrossOrigin(origins = "*", allowedHeaders = "*")
	@RequestMapping(value = "/list", method = RequestMethod.GET)
	public ResultVO getHostsList() {
		return service.getAllSavedHostsList();
	}

}
