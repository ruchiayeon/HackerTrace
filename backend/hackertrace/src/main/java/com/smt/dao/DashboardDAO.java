package com.smt.dao;

import java.util.ArrayList;
import java.util.List;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Repository;

import com.mongodb.BasicDBObject;
import com.mongodb.client.MongoCollection;
import com.smt.util.DateUtil;
import com.smt.util.MogoDBUtil;

@Repository
public class DashboardDAO {
	
	@Autowired
	private MongoTemplate mongoTemplate;
	
	//hostip, phase, 기간
	public Integer countAuditLogByAttakPhases(String hostIp, List<String> tList, String term) {
		Integer staticsResult = 0;
		
		MongoCollection<Document> audtiLogListCol = mongoTemplate.getCollection("AUDIT_LOG");
		
		String endDate = DateUtil.getTodayDate();
		String startDate = "";
		if(term.equalsIgnoreCase("today")) //오늘
			startDate = endDate;
		else if(term.equalsIgnoreCase("week")) //일주일 전 
			startDate = DateUtil.beforDateDayUnit(endDate, "7");
		else //1달전
			startDate = DateUtil.beforDateMonthUnit(endDate, "1"); 
		
		BasicDBObject findQuery = MogoDBUtil.getDateTermFindQuery("body_event_time", startDate, endDate);
		findQuery.put("body_host_ip", hostIp);
		
		List<BasicDBObject> keyQueryList = new ArrayList<>();
		for(String tVal : tList) {
			keyQueryList.add(new BasicDBObject("body_key", "\""+tVal+"\""));
		}
		
		findQuery.put("$or", keyQueryList); //공격 단계별
		System.out.println(findQuery.toJson());
		staticsResult = (int) audtiLogListCol.countDocuments(findQuery);
		return staticsResult;
	}

}
