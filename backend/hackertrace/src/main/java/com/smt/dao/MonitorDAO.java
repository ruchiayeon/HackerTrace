package com.smt.dao;

import java.util.ArrayList;
import java.util.List;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Repository;

import com.mongodb.BasicDBObject;
import com.mongodb.client.MongoCollection;
import com.smt.util.MogoDBUtil;
import com.smt.vo.MonitorLogListVO;

@Repository
public class MonitorDAO {

	@Autowired
	private MongoTemplate mongoTemplate;
	
	public List<Document> getHostMonitorList(MonitorLogListVO vo){
		MongoCollection<Document> hostMonitorCol = mongoTemplate.getCollection("HOST_MONITOR");
		
		BasicDBObject findQuery = new BasicDBObject();
		findQuery.put("HostIP", vo.getHostIp());
		findQuery.put("date", MogoDBUtil.getDateTermFindQuery(vo.getStartDate(), vo.getEndDate()) );

		System.out.println(findQuery.toJson());
		Document sortDoc = new Document();
		sortDoc.put("date", -1);
		
		return  hostMonitorCol.find(findQuery)
									   .sort(sortDoc)
								       .limit(vo.getPageSize())
								       .skip(vo.getPageNumber()-1)
								       .into(new ArrayList<>());
		
	}
	

	

}
