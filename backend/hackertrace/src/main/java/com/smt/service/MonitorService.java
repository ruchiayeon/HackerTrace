package com.smt.service;

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
		return dao.getHostMonitorList(vo);
	}

}
