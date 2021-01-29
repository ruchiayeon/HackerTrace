package com.smt.scheduler;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.mongodb.BasicDBObject;
import com.mongodb.client.MongoCollection;
import com.smt.service.HostsService;
import com.smt.util.DateUtil;
import com.smt.util.MogoDBUtil;

@Component
public class AuditLogScheduler {

	@Autowired
	HostsService hostService;
	
	@Autowired
	private MongoTemplate mongoTemplate;
	
//	@Scheduled(cron = "${fixed.delay.string.audit.uid.ses}") 
	public void excuteAggregateUid() throws InterruptedException {
		
		try {
			MongoCollection<Document> auditLogCol = mongoTemplate.getCollection("AUDIT_LOG");
			MongoCollection<Document> auditLogUidSesCol =  mongoTemplate.getCollection("AUDIT_LOG_UID_SES");
		
			for( Map<String, String> doc : hostService.getAllSavedHostsList()) {
				
					Document resultDoc = new Document();
				
					String startDate = DateUtil.getTodayDate();
					String endDate = startDate;
					String hostIp = doc.get("hostIp");
				
					BasicDBObject matchConditionQuery =new BasicDBObject();
					matchConditionQuery.put("body_host_ip", doc.get("hostIp"));
					matchConditionQuery.put("body_key", new BasicDBObject("$regex", ".*T.*"));
					matchConditionQuery.put("body_key", new BasicDBObject("$ne", null));
					matchConditionQuery.put("body_event_time", MogoDBUtil.getDateTermFindQuery(startDate, endDate) );
					
					//init aggregate query
					List<BasicDBObject> uidQueryList = new ArrayList<BasicDBObject>();
					
					BasicDBObject matchQuery = new BasicDBObject("$match", matchConditionQuery);
					BasicDBObject groupQuery = new BasicDBObject("$group", new BasicDBObject("_id", "$body_uid"));
					
					uidQueryList.add(matchQuery);
					uidQueryList.add(groupQuery);
					
					//only uid aggregate
					List<Document> uidDocList = auditLogCol.aggregate(uidQueryList).into(new ArrayList<>());
					
					for(Document uidDoc : uidDocList) {
						
						String uid = (String)uidDoc.get("_id");
						
						resultDoc.put("createDate",  startDate);
						resultDoc.put("hostIp", hostIp);
						resultDoc.put("uid", uid);
						
						//init aggregate query
						List<BasicDBObject> sesGroupQueryList = new ArrayList<BasicDBObject>();
						
						matchConditionQuery.put("body_uid", uid);
						
						BasicDBObject sesMatchQuery = new BasicDBObject("$match", matchConditionQuery);
						BasicDBObject sesGroupQuery = new BasicDBObject("$group", new BasicDBObject("_id", "$body_ses"));
						sesGroupQueryList.add(sesMatchQuery);
						sesGroupQueryList.add(sesGroupQuery);
						
						//only ses aggregate 
						List<Document> sesDocList = auditLogCol.aggregate(sesGroupQueryList).into(new ArrayList<>());
						List<String> sesList = new ArrayList<String>();
						for(Document sesDoc:sesDocList) {
							if(sesDoc.get("_id") != null)
								sesList.add((String)sesDoc.get("_id"));
						}
						resultDoc.put("ses", sesList);
						
						BasicDBObject findQuery =new BasicDBObject();
						findQuery.put("createDate", startDate);
						findQuery.put("hostIp", hostIp);
						findQuery.put("uid", uid);
						
						if((int)auditLogUidSesCol.countDocuments(findQuery) < 1) {
							auditLogUidSesCol.insertOne(resultDoc);
						}else {
							auditLogUidSesCol.updateOne(findQuery, new Document("$set", resultDoc) );
						}
						
					}
			
			}
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		
		
	}
	
	
}
