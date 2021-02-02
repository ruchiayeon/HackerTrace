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
			startDate = DateUtil.beforeDateDayUnit(endDate, "7");
		else //1달전
			startDate = DateUtil.beforDateMonthUnit(endDate, "1"); 
			
			List<BasicDBObject> keyQueryList = new ArrayList<>();
			for(String tVal : tList) {
				keyQueryList.add(new BasicDBObject("body_key", "\""+tVal+"\""));
			}
			
			BasicDBObject findQuery = new BasicDBObject("$or", keyQueryList);
			findQuery.put("body_host_ip", hostIp);
			findQuery.put("body_event_time", MogoDBUtil.getDateTermFindQuery(startDate, endDate) );
			
			System.out.println(findQuery.toJson());
			staticsResult = String.valueOf((int)audtiLogListCol.countDocuments(findQuery));
		
		return staticsResult;
	}
	
	public boolean existAuditLogByHostIp(String hostIp) {
		long countAuditLogByIp = 0;
		MongoCollection<Document> audtiLogListCol = mongoTemplate.getCollection("AUDIT_LOG");
		BasicDBObject findQuery = new BasicDBObject("body_host_ip", hostIp);
		countAuditLogByIp = (int)audtiLogListCol.countDocuments(findQuery);
		System.out.println(countAuditLogByIp);
		return countAuditLogByIp>0?true:false;
	}
	
	public Document getStatsMitreCountInfo(String hostIp, String type, String term) {
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
			startDate = DateUtil.beforeDateDayUnit(endDate, "7");
		else //1달전
			startDate = DateUtil.beforDateMonthUnit(endDate, "1"); 
		
		findQuery.put("createDate", new BasicDBObject("$gte", startDate).append( "$lte" , endDate ) );
		
		System.out.println(findQuery.toJson());
		if((int)statsCol.countDocuments(findQuery)>0) {
			
			resultList = statsCol.find(findQuery).into(new ArrayList<>());
	
			result.put("updateTime", resultList.get(0).get("updateTime"));
			
			for (KillChainPhases phases : KillChainPhases.values()) {
				  //TODO : change mongodb query
					int sum = 0;
					for(Document doc : resultList) {
						if(doc.containsKey(phases.getName())){
							String countVal = (String) doc.get(phases.getName());
							sum += Integer.parseInt(countVal);
						}
					}
					result.put(phases.getName(), sum);
			}
			
		} else { //통계 collection에 통계정보가 없을 시
			
			result.put("updateTime", "0000-0000-00 00:00:00");
			for (KillChainPhases phases : KillChainPhases.values()) {
				result.put(phases.getName(), 0);
			}
			
		}
		
		return result != null?result:null;
	}
	
	public Document getConfigModifyCountWeek(String hostIp, String type) {
		MongoCollection<Document> statsCol = mongoTemplate.getCollection("DB_STATS");

		Document result = new Document();
		String today = DateUtil.getTodayDate();
		try {

			List<Document> countDocList = new ArrayList<Document>();
			for (int index = 6; index > -1; index--) {

				String beforeDate = DateUtil.beforeDateDayUnit(today, String.valueOf(index));

				BasicDBObject findQuery = new BasicDBObject();
				findQuery.put("hostIp", hostIp);
				findQuery.put("type", type);
				findQuery.put("createDate", beforeDate);
				System.out.println(findQuery.toJson());

				List<Document> countList = statsCol.find(findQuery).into(new ArrayList<>());
				Integer count = 0;
				String updateTime = "";
				List<String> pathList = new ArrayList<String>();

				if (countList.size() > 0) {
					Document countDoc = new Document();
					countDoc = countList.get(0);
					count = (int)(countDoc.get("count"));
					updateTime = countDoc.getString("updateTime");
					pathList = (List<String>) countDoc.get("pathList");
				}

				if(updateTime == "")
					updateTime = "00-00-00 00:00:00";
				
				if(pathList == null)
					pathList = new ArrayList<String>();
				
				Document doc = new Document();
				doc.put(DateUtil.getDateDay(beforeDate), String.valueOf(count));
				doc.put("date", beforeDate);
				doc.put("updateTime", updateTime);
				doc.put("pathList", pathList);
				countDocList.add(doc);
			}

			result.put("chart_data", countDocList);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return result;
	}
	
	public Document getConfigModifyCount(String hostIp, String type, String term) {
		
		MongoCollection<Document> statsCol = mongoTemplate.getCollection("DB_STATS");
		Document result = new Document();
		
		String endDate = DateUtil.getTodayDate();
		String startDate = "";
		if(term.equalsIgnoreCase("today")) //오늘
			startDate = endDate;
		else if(term.equalsIgnoreCase("week")) //일주일 전 
			startDate = DateUtil.beforeDateDayUnit(endDate, "7");
		else //1달전
			startDate = DateUtil.beforDateMonthUnit(endDate, "1"); 
		
		try {
			
			BasicDBObject findQuery = new BasicDBObject();
			findQuery.put("hostIp", hostIp);
			findQuery.put("type", type);
			findQuery.put("createDate", new BasicDBObject("$gte", startDate).append( "$lte" , endDate ) );
			System.out.println(findQuery.toJson());

			List<Document> countList = statsCol.find(findQuery).into(new ArrayList<>());
			Integer sum = 0;
			String updateTime = "";
			
			for(Document doc : countList) {
				sum += doc.getInteger("count");
				updateTime = (String)doc.get("updateTime");
			}
			
			result.put("count", String.valueOf(sum));
			result.put("updateTime", updateTime);
			
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return result;
	}

}
