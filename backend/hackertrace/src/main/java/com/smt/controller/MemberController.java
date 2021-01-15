package com.smt.controller;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.smt.service.MemberService;
import com.smt.util.APIUtil;
import com.smt.vo.MemberVO;
import com.smt.vo.ResultVO;

import io.swagger.annotations.Api;

@RestController
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RequestMapping("/member")
@Api(value = "MemberController", description = "회원가입관련")
public class MemberController {
	
	@Autowired
	private MemberService memberService;
	
	@CrossOrigin(origins = "*", allowedHeaders = "*")
	@RequestMapping(value="/register", method = RequestMethod.POST)
	public ResultVO regMember(final @Valid @RequestBody MemberVO memberVO) {
	
		try {
			
			if(!memberService.checkFindUserId(memberVO)) {
				return APIUtil.resResult(-9, "이미 등록된 아이디가 존재합니다.", null);
			}
				
			memberService.regMember(memberVO);
			return APIUtil.resResult(0, "사용자 등록이 완료되었습니다.", null);
			
		}catch(Exception e) {
			e.printStackTrace();
			return APIUtil.resResult(1, "사용자 등록이 실패되었습니다.", null);
		}
		
	}

}
