package com.smt.scheduler;

import org.bson.Document;
import org.bson.conversions.Bson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.mongodb.BasicDBObject;
import com.mongodb.client.MongoCollection;
import com.smt.service.DashboardService;
import com.smt.service.HostsService;
import com.smt.util.DateUtil;

@Component
public class StatsScheduler {
	
	@Autowired
	HostsService hostService;
	
	@Autowired
	DashboardService dashboardService;
	
	@Autowired
	private MongoTemplate mongoTemplate;

//	@Scheduled(cron = "${fixed.delay.string.audit.status}") 
	public void excuteCountMitreAttackAuditLog() {
		
		System.out.println("excuteCountMitreAttackAuditLog()"+DateUtil.getCurrentTime());
		long beforeTime = System.currentTimeMillis();
		MongoCollection<Document> statsCountCol = mongoTemplate.getCollection("DB_STATS");
		try {
			
			for( Document doc : hostService.getAllSavedHostsList()) {
				
				String type = "mitre";
				String hostIp = doc.getString("hostIp");
				String today = DateUtil.getTodayDate();
				String current = DateUtil.getCurrentTime();
				
				Document countResult = dashboardService.countMitreAttackByAuditLog(hostIp);
				
				
				countResult.put("type", type);
				countResult.put("hostIp", hostIp);
				countResult.put("createDate", today);
				countResult.put("updateTime", current);
				
				BasicDBObject findQuery = new BasicDBObject("hostIp", hostIp);
				findQuery.put("type", type);
				findQuery.put("createDate", today);
				
				if(statsCountCol.countDocuments(findQuery) > 0) {
					statsCountCol.updateOne(findQuery, new Document("$set", countResult) );
				}else {
					statsCountCol.insertOne(countResult);
				}
				
			}
		
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		long afterTime = System.currentTimeMillis(); 
		long secDiffTime = (afterTime - beforeTime)/1000;
		System.out.println("시간차이(m) : "+secDiffTime);
		System.out.println("end"+DateUtil.getCurrentTime());
		
		
	}

}
