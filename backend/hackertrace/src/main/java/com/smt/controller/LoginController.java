package com.smt.controller;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.smt.service.LoginService;
import com.smt.util.APIUtil;
import com.smt.vo.LoginVO;
import com.smt.vo.ResultVO;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequestMapping("/login")
@Api(value = "LoginController", description = "로그인 관련")
public class LoginController {
	
	@Autowired
	LoginService service;
	
	@ApiOperation(value = "사용자 로그인 인증")
	@CrossOrigin(origins = "*", allowedHeaders = "*")
	@RequestMapping(value="/user", method = RequestMethod.POST)
	public ResultVO reqUserLogin(final @Valid @RequestBody LoginVO loginVO) {
		
		int checkUserInfo =service.checkUserInfo(loginVO);
		
		if( checkUserInfo == 0)
			return APIUtil.resResult(checkUserInfo, "사용자 인증이 완료되었습니다.", null);
		else if(checkUserInfo == -5)
			return APIUtil.resResult(checkUserInfo, "알 수 없는 사용자입니다.", null);
		else
			return APIUtil.resResult(checkUserInfo, "사용자 인증에 실패되었습니다.", null);
		
	}
		
		
}
