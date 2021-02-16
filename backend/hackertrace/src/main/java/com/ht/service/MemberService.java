package com.ht.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ht.dao.MemberDAO;
import com.ht.util.EncryptUtil;
import com.ht.vo.MemberVO;

@Service
public class MemberService {

	@Autowired
	MemberDAO memberDao;
	
	public boolean checkFindUserId(MemberVO vo) {
		return (memberDao.findUserId(vo).size()>0)?false:true;
	}

	public void regMember(MemberVO vo) {
		
		String shaPassword = EncryptUtil.genSHA256(vo.getPassword());
		vo.setPassword(shaPassword);
		memberDao.regMember(vo);
		
	}
}
