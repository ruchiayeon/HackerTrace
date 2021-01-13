package com.smt.service;

import java.util.List;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smt.dao.ConfigLogDAO;
import com.smt.vo.ConfigLogListVO;
import com.smt.vo.ConfigLogVO;

@Service
public class ConfigLogService {
	
	@Autowired
	ConfigLogDAO dao;
	
	public void dropCofingOriginFile() {
		dao.dropConfigOriginFile();
	}
	
	public boolean insertConfigOriginFile(ConfigLogVO vo) {
		boolean result = false;
		if(dao.selectConfigOriginFile(vo).size()<1) {
			dao.insertConfigOrginFile(vo);
			result = true;
		}
		return result;
	}
	
	public void insertConfigLogFile(ConfigLogVO vo) {
		dao.insertConfigLogFile(vo);
	}
	
	public List<Document> selectConfigLogFileList(ConfigLogListVO vo){
		return dao.selectConfigLogFileList(vo);
	}

}
