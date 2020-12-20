package com.smt.controller;

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
	public ResultVO regMember(@RequestBody MemberVO memberVO) {
		ResultVO result = new ResultVO();
	
		if(!memberService.checkFindUserId(memberVO)) {
			result.setErrCode(-9);
			result.setMsg("�̹� ��ϵ� ���̵� �Դϴ�.");
		}
			
		memberService.regMember(memberVO);
		result.setErrCode(0);
		result.setMsg("����� ����� �Ϸ�Ǿ����ϴ�.");
		
		return result;
	}

}