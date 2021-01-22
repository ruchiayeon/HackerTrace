package com.smt.service;

import java.util.ArrayList;
import java.util.List;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smt.dao.HostsDAO;
import com.smt.util.APIUtil;
import com.smt.vo.HostsVO;
import com.smt.vo.ResultVO;

@Service
public class HostsService {

	@Autowired
	HostsDAO dao;

	public ResultVO insertHosts(HostsVO vo) {
		try {

			if (dao.countHostsByUserIp(vo) > 0) {
				return APIUtil.resResult(-8, "이미 등록 된 호스트 IP입니다.", null);
			}

			dao.insertHosts(vo);
			return APIUtil.resResult(0, "호스트 등록이 완료되었습니다.", null);

		} catch (Exception e) {
			return APIUtil.resResult(1, "호스트 등록이 실패되었습니다.", null);
		}
	}

	public List<Document> getAllSavedHostsList() {
			List<Document> hostsList = new ArrayList<>();
			hostsList = dao.getAllSavedHostsList();
			return hostsList;
	}

}
