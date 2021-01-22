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
import com.smt.util.KillChainPhases;
import com.smt.util.MogoDBUtil;

@Repository
public class DashboardDAO {
	
	@Autowired
	private MongoTemplate mongoTemplate;
	
	//hostip, phase, 기간
	public String countAuditLogByAttakPhases(String hostIp, List<String> tList, String term) {
		String staticsResult = "";
		
		MongoCollection<Document> audtiLogListCol = mongoTemplate.getCollection("AUDIT_LOG");
		
		String endDate = DateUtil.getTodayDate();
		String startDate = "";
		if(term.equalsIgnoreCase("today")) //오늘
			startDate = endDate;
		else if(term.equalsIgnoreCase("week")) //일주일 전 
			startDate = DateUtil.beforDateDayUnit(endDate, "7");
		else //1달전
			startDate = DateUtil.beforDateMonthUnit(endDate, "1"); 
		
//		BasicDBObject findQuery = MogoDBUtil.getDateTermFindQuery("body_event_time", startDate, endDate);
			
			List<BasicDBObject> keyQueryList = new ArrayList<>();
			for(String tVal : tList) {
				keyQueryList.add(new BasicDBObject("body_key", "\""+tVal+"\""));
			}
			
			BasicDBObject findQuery = new BasicDBObject("$or", keyQueryList);
			findQuery.put("body_host_ip", hostIp);
			String sDate = startDate+" 00:00:00";
			String eDate = endDate+" 23:59:59";
			findQuery.put("body_event_time", new BasicDBObject("$gte", sDate).append( "$lte" , eDate ) );
			
			System.out.println(findQuery.toJson());
			staticsResult = String.valueOf( audtiLogListCol.countDocuments(findQuery));
		
		return staticsResult;
	}
	
	public boolean existAuditLogByHostIp(String hostIp) {
		long countAuditLogByIp = 0;
		MongoCollection<Document> audtiLogListCol = mongoTemplate.getCollection("AUDIT_LOG");
		BasicDBObject findQuery = new BasicDBObject("body_host_ip", hostIp);
		countAuditLogByIp = audtiLogListCol.countDocuments(findQuery);
		System.out.println(countAuditLogByIp);
		return countAuditLogByIp>0?true:false;
	}
	
	public Document getStatsCountInfo(String hostIp, String type, String term) {
		Document result = new Document();
		List<Document> resultList  = new ArrayList<>();
		MongoCollection<Document> statsCol = mongoTemplate.getCollection("DB_STATS");
		
		BasicDBObject findQuery = new BasicDBObject("hostIp", hostIp);
		findQuery.put("type", type);
		
		String endDate = DateUtil.getTodayDate();
		String startDate = "";
		if(term.equalsIgnoreCase("today")) //오늘
			startDate = endDate;
		else if(term.equalsIgnoreCase("week")) //일주일 전 
			startDate = DateUtil.beforDateDayUnit(endDate, "7");
		else //1달전
			startDate = DateUtil.beforDateMonthUnit(endDate, "1"); 
		
		findQuery.put("createDate", new BasicDBObject("$gte", startDate).append( "$lte" , endDate ) );
		
		System.out.println(findQuery.toJson());
		if(statsCol.countDocuments(findQuery)>0) {
			resultList = statsCol.find(findQuery).into(new ArrayList<>());
	
			result.put("updateTime", resultList.get(0).get("updateTime"));
			for (KillChainPhases phases : KillChainPhases.values()) {
					int sum = 0;
					for(Document doc : resultList) {
						if(doc.containsKey(phases.getName())){
							String countVal = (String) doc.get(phases.getName());
							sum += Integer.parseInt(countVal);
						}
					}
					result.put(phases.getName(), sum);
			}
		}else {
			result = null;
		}
		
		
		return result != null?result:null;
	}

}
