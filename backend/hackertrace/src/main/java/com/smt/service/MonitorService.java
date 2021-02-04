package com.smt.service;

import java.util.ArrayList;
import java.util.List;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smt.dao.MonitorDAO;
import com.smt.vo.MonitorLogListVO;

@Service
public class MonitorService {

	@Autowired
	MonitorDAO dao;

	public List<Document> getHostMonitorList(MonitorLogListVO vo) {
		List<Document> monitorResultList = new ArrayList<Document>();
		for(Document monitorDoc : dao.getHostMonitorList(vo)) {
			
			Document resultDoc = new Document();
			resultDoc.put("HostIP", monitorDoc.get("HostIP"));
			resultDoc.put("date", monitorDoc.get("date"));
			resultDoc.put(vo.getUseFieldType(), monitorDoc.get(vo.getUseFieldType()));
			monitorResultList.add(resultDoc);
		}
		
		return monitorResultList;
	}

}
