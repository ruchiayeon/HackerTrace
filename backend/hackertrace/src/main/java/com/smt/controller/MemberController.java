package com.smt.controller;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.smt.service.MemberService;
import com.smt.vo.MemberVO;
import com.smt.vo.ResultVO;

@RestController
@RequestMapping("/member")
public class MemberController {
	
	@Autowired
	private MemberService memberService;
	
	@RequestMapping(value="/register", method = RequestMethod.POST)
	public ResultVO regMember(final @Valid @RequestBody MemberVO memberVO) {
		ResultVO result = new ResultVO();
	
		try {
			
			if(!memberService.checkFindUserId(memberVO)) {
				result.setErrCode(-9);
				result.setMsg("이미 등록된 아이디 입니다.");
				return result;
			}
				
			memberService.regMember(memberVO);
			result.setErrCode(0);
			result.setMsg("사용자 등록이 완료되었습니다.");
			
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return result;
	}

}
