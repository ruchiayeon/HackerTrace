package com.ht.service;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ht.dao.LoginDAO;
import com.ht.util.EncryptUtil;
import com.ht.vo.LoginVO;

@Service
public class LoginService {

	@Autowired
	LoginDAO dao;

	public int checkUserInfo(LoginVO vo) {

		int result = 0;
		if(dao.findUserInfoByUserId(vo) !=null) { //미등록 사용자
			Document userInfoDoc = dao.findUserInfoByUserId(vo);
			String reqPassword = EncryptUtil.genSHA256(vo.getPassword());
			
			//패스워드 검사
			if (!reqPassword.equals(userInfoDoc.get("password")))
				result = 1;
			
		}else {
			result = -5;
		}

		return result;

	}

}
