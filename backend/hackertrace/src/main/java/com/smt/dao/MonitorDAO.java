package com.smt.dao;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

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
		MongoCollection<Document> hostMonitorCol = mongoTemplate.getCollection("HOSTS_MONITOR");
		
		BasicDBObject findQuery = new BasicDBObject();
		findQuery.put("body_host_ip", vo.getHostIp());
		
		if(vo.getSearchType() != "") {
			findQuery.put(vo.getSearchType(), Pattern.compile(vo.getSearchWord(), Pattern.CASE_INSENSITIVE) );
		}
		
		findQuery.put("body_event_time", MogoDBUtil.getDateTermFindQuery(vo.getStartDate(), vo.getEndDate()) );

		System.out.println(findQuery.toJson());
		
		return  hostMonitorCol.find(findQuery)
								       .limit(vo.getPageSize())
								       .skip(vo.getPageNumber()-1)
								       .into(new ArrayList<>());
		
	}
	

	

}
