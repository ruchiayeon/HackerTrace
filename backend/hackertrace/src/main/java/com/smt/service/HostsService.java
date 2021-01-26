package com.smt.service;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

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


	public  List<Map<String,String>> getAllSavedHostsList() throws UnsupportedEncodingException {
		 List<Map<String,String>> hostsList = new ArrayList<>();
			hostsList = dao.getAllSavedHostsList();
			return hostsList;
	}
	

	public List<Document> getHostsListByUserId(String userId) {
			List<Document> hostsList = new ArrayList<>();
			hostsList = dao.getHostsListByUserId(userId);
			return hostsList;
	}

}
