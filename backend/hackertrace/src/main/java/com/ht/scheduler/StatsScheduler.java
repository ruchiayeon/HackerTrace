package com.ht.scheduler;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.ht.service.DashboardService;
import com.ht.service.HostsService;
import com.ht.util.DateUtil;
import com.ht.util.FileUtil;
import com.ht.util.MogoDBUtil;
import com.mongodb.BasicDBObject;
import com.mongodb.client.MongoCollection;

@Component
public class StatsScheduler {
	
	@Autowired
	HostsService hostService;
	
	@Autowired
	DashboardService dashboardService;
	
	@Autowired
	private MongoTemplate mongoTemplate;

	@Scheduled(cron = "${fixed.delay.string.audit.status}") 
	public void excuteCountMitreAttackAuditLog() {
			System.out.println("excuteCountMitreAttackAuditLog()");
		try {
			MongoCollection<Document> statsCountCol = mongoTemplate.getCollection("DB_STATS");
			
			for( Map<String, String> doc : hostService.getAllSavedHostsList()) {
				
				String type = "mitre"; //마이터
				String hostIp = doc.get("hostIp");
				String todayDate = DateUtil.getTodayDate();
				String current = DateUtil.getCurrentTime();
				
				Document countResult = dashboardService.countMitreAttackByAuditLog(hostIp);
				
				countResult.put("type", type);
				countResult.put("hostIp", hostIp);
				countResult.put("createDate", todayDate);
				countResult.put("updateTime", current);
				
				BasicDBObject findQuery = new BasicDBObject("hostIp", hostIp);
				findQuery.put("type", type);
				findQuery.put("createDate", todayDate);
				
				if((int)statsCountCol.countDocuments(findQuery) > 0) {
					statsCountCol.updateOne(findQuery, new Document("$set", countResult) );
				}else {
					statsCountCol.insertOne(countResult);
				}
				
			}
		
		}catch(Exception e) {
			e.printStackTrace();
		}
		
	}
	
	@Scheduled(cron = "${fixed.delay.string.config.status}") 
	public void excuteCountConfigModify() {
		System.out.println("excuteCountConfigModify()");
		try {
			
			MongoCollection<Document> statsCountCol = mongoTemplate.getCollection("DB_STATS");
			
			for( Map<String, String> map : hostService.getAllSavedHostsList()) {
				
				String type = "config"; //형상관리
				String hostIp = map.get("hostIp");
				String todayDate = DateUtil.getTodayDate();
				String current = DateUtil.getCurrentTime();
				
				MongoCollection<Document> configFileCol = mongoTemplate.getCollection("CONFIG_FILES_LOGS");
				
				BasicDBObject findLogQuery =new BasicDBObject();
				findLogQuery.put("hostIp", hostIp);
				findLogQuery.put("fileCreateDate", MogoDBUtil.getDateTermFindQuery(DateUtil.getTodayDate(), DateUtil.getTodayDate()) );
				List<Document> countConfigLog =configFileCol.find(findLogQuery).into(new ArrayList<Document>());
				List<String> filePathList = new ArrayList<String>();
				for(Document doc : countConfigLog) {
					String filePath = FileUtil.getOnlyPathByRemainFullPath((String)doc.get("filePath"));
					filePathList.add(filePath+"/"+(String)doc.get("fileName"));
				}
				
				Document countResult = new Document();
				countResult.put("type", type);
				countResult.put("hostIp", hostIp);
				countResult.put("createDate", todayDate);
				countResult.put("updateTime", current);
				countResult.put("count", countConfigLog.size());
				countResult.put("pathList", filePathList);
				
				BasicDBObject findQuery = new BasicDBObject("hostIp", hostIp);
				findQuery.put("type", type);
				findQuery.put("createDate", todayDate);
				
				if(statsCountCol.countDocuments(findQuery) > 0) {
					statsCountCol.updateOne(findQuery, new Document("$set", countResult) );
				}else {
					statsCountCol.insertOne(countResult);
				}
			}
			
		}catch(Exception e) {
			e.printStackTrace();
		}
		
	}

}
