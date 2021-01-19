package com.smt.service;

import java.util.ArrayList;
import java.util.List;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smt.dao.ConfigLogDAO;
import com.smt.vo.ConfigLogHistoryVO;
import com.smt.vo.ConfigLogListVO;
import com.smt.vo.ConfigLogSessionsVO;
import com.smt.vo.ConfigLogVO;
import com.smt.vo.ConfigOriginVO;

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
	
	public List<Document> selectConfigOriginFilePath(){
		return dao.selectConfigOriginFilePath();
	}
	
	public void insertConfigLogFile(ConfigLogVO vo) {
		dao.insertConfigLogFile(vo);
	}
	
	public List<Document> selectConfigLogFileList(ConfigLogListVO vo){
		List<Document> resultList = new ArrayList<Document>();
		for(Document doc : dao.selectConfigLogFileList(vo)) {
			Document fileLogDocument = new Document();
			fileLogDocument.put("_id", doc.get("_id").toString());
			fileLogDocument.put("hostIp", doc.get("hostIp"));
			fileLogDocument.put("fileName", doc.get("fileName"));
			fileLogDocument.put("filePath", doc.get("filePath"));
			fileLogDocument.put("uid", doc.get("uid"));
			fileLogDocument.put("fileCreateDate", doc.get("fileCreateDate"));
			
			resultList.add(fileLogDocument);
		}
		
		return resultList;
	}
	
	public Document selectConfigOriginLogFileContents(ConfigOriginVO vo) {
		return dao.selectConfigOriginLogFileContents(vo);
	}
	
	public List<Document> selectBefroDateAuditLogSessionList(ConfigLogSessionsVO vo){
		return dao.selectBefroDateAuditLogSessionList(vo);
	}
	
	public List<Document> selectBeforDateAuditLogByConfigLog(ConfigLogHistoryVO vo){
		return dao.selectBeforDateAuditLogByConfigLog(vo);
	}
	

}
