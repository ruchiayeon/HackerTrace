package com.smt.dao;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

import org.bson.Document;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Repository;

import com.mongodb.BasicDBObject;
import com.mongodb.client.MongoCollection;
import com.smt.util.DateUtil;
import com.smt.util.MogoDBUtil;
import com.smt.vo.ConfigContentsVO;
import com.smt.vo.ConfigLogContentsVO;
import com.smt.vo.ConfigLogSesCondVO;
import com.smt.vo.ConfigLogHistoryVO;
import com.smt.vo.ConfigLogListVO;
import com.smt.vo.ConfigLogPathsVO;
import com.smt.vo.ConfigLogSessionsVO;
import com.smt.vo.ConfigLogVO;
import com.smt.vo.DirectoryTopVO;
import com.smt.vo.DirectoryVO;

@Repository
public class ConfigLogDAO {

	@Autowired
	private MongoTemplate mongoTemplate;
	
	public void dropConfigOriginFile() {
		mongoTemplate.dropCollection("CONFIG_FILES_ORIGIN");
	}
	
	public void dropConfigOriginLogFile() {
		mongoTemplate.dropCollection("CONFIG_FILES_LOGS");
	}
	
	public List<Document> selectConfigOriginFile(ConfigLogVO vo){
		MongoCollection<Document> configFilesOriginListCol = mongoTemplate.getCollection("CONFIG_FILES_ORIGIN");
		
		BasicDBObject findQuery = new BasicDBObject("fileName", vo.getFileName());
		
		System.out.println(findQuery.toJson());
		return configFilesOriginListCol.find(findQuery).into(new ArrayList<>());
	}
	
	public void insertConfigOrginFile(ConfigLogVO vo) {
		mongoTemplate.insert(vo, "CONFIG_FILES_ORIGIN");
	}
	
	public void insertConfigLogFile(ConfigLogVO vo) {
		mongoTemplate.insert(vo, "CONFIG_FILES_LOGS");
	}
	
	public void insertConfigLogDirectory(DirectoryVO vo) {
		mongoTemplate.insert(vo, "CONFIG_FILE_DIRECTORY");
	}
	
	public List<Document> selectConfigLogDirectory(DirectoryVO vo) {
		MongoCollection<Document> configFileDirectoryCol = mongoTemplate.getCollection("CONFIG_FILE_DIRECTORY");
		BasicDBObject findQuery = new BasicDBObject();
		findQuery.put("hostIp", vo.getHostIp());
		findQuery.put("filePath", vo.getFilePath());
		return configFileDirectoryCol.find(findQuery).into(new ArrayList<>());
	}
	
	public void updateConfigLogDirctoryFileNames(DirectoryVO vo, Document doc) {
		
		MongoCollection<Document> configFileDirectoryCol = mongoTemplate.getCollection("CONFIG_FILE_DIRECTORY");
		BasicDBObject findQuery = new BasicDBObject();
		findQuery.put("hostIp", vo.getHostIp());
		findQuery.put("filePath", vo.getFilePath());
		configFileDirectoryCol.updateOne(findQuery, new Document("$set", doc) );
		
	}
	
	public List<Document> selectConfigFileDirectory(DirectoryTopVO vo){
		MongoCollection<Document> configFilesDirectoryListCol = mongoTemplate.getCollection("CONFIG_FILE_DIRECTORY");
		BasicDBObject findQuery = new BasicDBObject();
		findQuery.put("hostIp", vo.getHostIp());
		findQuery.put("filePath", new BasicDBObject("$regex", vo.getTopDirectory()+"/*"));
		
		List<Document> dirListDoc = configFilesDirectoryListCol.find(findQuery).into(new ArrayList<>());
		
		return dirListDoc;
	}
	
	public List<String> getFileNamesByFilePath(DirectoryTopVO vo){
		MongoCollection<Document> configFilesDirectoryListCol = mongoTemplate.getCollection("CONFIG_FILE_DIRECTORY");
		BasicDBObject findQuery = new BasicDBObject();
		findQuery.put("hostIp", vo.getHostIp());
		findQuery.put("filePath", vo.getTopDirectory());
		
		List<String> fileNameList = new ArrayList<String>();
		List<Document> docList = configFilesDirectoryListCol.find(findQuery).into(new ArrayList<>());
		if(docList.size()>0)
			fileNameList = (List<String>) docList.get(0).get("fileNames");
		
		return fileNameList;
	}
	
	public List<Document> selectConfigLogPathList(ConfigLogPathsVO vo){
		MongoCollection<Document> configFilesLogsListCol = mongoTemplate.getCollection("CONFIG_FILES_LOGS");
		String startDate = vo.getStartDate();
		String endDate = vo.getEndDate();
		
		BasicDBObject findQuery = new BasicDBObject("fileCreateDate", MogoDBUtil.getDateTermFindQuery(startDate, endDate));
		findQuery.put("hostIp", vo.getHostIp());
		System.out.println(findQuery.toJson());
		return configFilesLogsListCol.find(findQuery).into(new ArrayList<>());
	}
	
	public List<Document> selectConfigLogFileList(ConfigLogListVO vo){
		
		MongoCollection<Document> configFilesLogsListCol = mongoTemplate.getCollection("CONFIG_FILES_LOGS");
		
		BasicDBObject findQuery = new BasicDBObject();
		findQuery.put("hostIp", vo.getHostIp());
		findQuery.put("filePath", "/home/manager/HostServer/"+vo.getHostIp()+vo.getFilePath());
		findQuery.put("fileName", vo.getFileName());
		
		//LIKE query 
		if(vo.getSearchType() != "" && vo.getSearchWord() !="") {
			
			//TODO:BUG.OR쿼리 사용 시 LIKE 쿼리 안먹힘 
			if(vo.getSearchType().equalsIgnoreCase("ALL")) {
				List<BasicDBObject> searchQueryList = new ArrayList<BasicDBObject>();
				searchQueryList.add(new BasicDBObject("fileName", vo.getSearchWord()));
				searchQueryList.add(new BasicDBObject("owner", vo.getSearchWord()));
				findQuery.put("$or", searchQueryList);
			}else { //전체 검색 조건
				findQuery.put(vo.getSearchType(), Pattern.compile(vo.getSearchWord(), Pattern.CASE_INSENSITIVE));
			}
			
		}
		
		findQuery.put("logTime", MogoDBUtil.getDateTermFindQuery(vo.getStartDate(), vo.getEndDate()) );
		System.out.println(findQuery.toJson());
		Document sortDoc = new Document();
		sortDoc.put("logTime", -1);
		return configFilesLogsListCol.find(findQuery)
											   .sort(sortDoc)
											   .limit(vo.getPageSize())
											   .skip(vo.getPageNumber()-1)
											   .into(new ArrayList<>());
	}
	
	public List<Document> selectConfigOriginLogFileContents(ConfigLogContentsVO vo){
		
		List<Document> resultList = new ArrayList<Document>();
		
		MongoCollection<Document> configFilesOriginListCol = mongoTemplate.getCollection("CONFIG_FILES_LOGS");
		
		BasicDBObject orgFileQuery = new BasicDBObject("_id", new ObjectId(vo.getOrgObjId()));
		BasicDBObject logFileQuery = new BasicDBObject("_id", new ObjectId(vo.getLogObjId()));
		
		List<Document> docOrgFileList =  configFilesOriginListCol.find(orgFileQuery).into(new ArrayList<>());
		List<Document> docLogFileList =  configFilesOriginListCol.find(logFileQuery).into(new ArrayList<>());
		
		if(docOrgFileList.size()>0)
			resultList.add(docOrgFileList.get(0));
		
		if(docLogFileList.size()>0)
			resultList.add(docLogFileList.get(0));
		
		return resultList;
		
	}
	
	public List<Document> selectConfigContents(ConfigContentsVO vo){
		
		List<Document> resultList = new ArrayList<Document>();
		
		MongoCollection<Document> configFilesOriginListCol = mongoTemplate.getCollection("CONFIG_FILES_LOGS");
		
		BasicDBObject orgFileQuery = new BasicDBObject("_id", new ObjectId(vo.getObjId()));
		
		List<Document> docFileList =  configFilesOriginListCol.find(orgFileQuery).into(new ArrayList<>());
		
		if(docFileList.size()>0)
			resultList.add(docFileList.get(0));
		
		return resultList;
		
	}
	
	public List<Document> selectBefroDateAuditLogSessionList(ConfigLogSessionsVO vo){
		
		MongoCollection<Document> audtiLogListCol = mongoTemplate.getCollection("AUDIT_LOG");
	    
	    String beforeEndDate = DateUtil.beforDateMonthUnit(vo.getFileCreateDate(), vo.getTerm());
	    BasicDBObject findQuery = new BasicDBObject();
		findQuery.put("body_host_ip", vo.getHostIp());
		findQuery.put("body_uid", vo.getUid());
		findQuery.put("body_event_time", MogoDBUtil.getDateTermFindQuery(beforeEndDate, vo.getFileCreateDate()) );
		
		BasicDBObject matchQuery = new BasicDBObject("$match", findQuery);
		BasicDBObject groupQuery = new BasicDBObject("$group", new BasicDBObject("_id", "$body_ses"));
		
		System.out.println(matchQuery.toJson());
		System.out.println(groupQuery.toJson());
		
		List<BasicDBObject> aggregateList = new ArrayList<BasicDBObject>();
		aggregateList.add(matchQuery);
		aggregateList.add(groupQuery);
		
		return audtiLogListCol.aggregate(aggregateList).into(new ArrayList<>());
		
	}
	
	public List<Document> historyConditionBodyName(ConfigLogSesCondVO vo){
		MongoCollection<Document> auditLogListCol = mongoTemplate.getCollection("AUDIT_LOG");
		
		BasicDBObject findQuery = new BasicDBObject();
		findQuery.put("body_host_ip", vo.getHostIp());
		findQuery.put("header_message:type", "PATH");
		
		List<BasicDBObject> orQueryList = new ArrayList<BasicDBObject>();
		orQueryList.add(new BasicDBObject("body_name","\""+vo.getFilePath()+"/"+vo.getFileName()+"\""));
		orQueryList.add(new BasicDBObject("body_name","\""+vo.getFileName()+"\""));
		findQuery.put("$or", orQueryList);
		
		String sDate = DateUtil.beforeDateDayUnit(vo.getFileCreateDate(), vo.getBeforeTerm())+" 00:00:00";
		String eDate = DateUtil.afterDateDayUnit(vo.getFileCreateDate(), vo.getAfterTerm())+" 23:59:59";
		findQuery.put("body_event_time", new BasicDBObject("$gte", sDate).append( "$lte" , eDate ) );
		
		BasicDBObject matchQuery = new BasicDBObject("$match", findQuery);
		BasicDBObject groupQuery = new BasicDBObject("$group", new BasicDBObject("_id", "$header_msg"));
			
		List<BasicDBObject> aggregateList = new ArrayList<BasicDBObject>();
		aggregateList.add(matchQuery);
		aggregateList.add(groupQuery);
		System.out.println(aggregateList.toString());
		return auditLogListCol.aggregate(aggregateList).into(new ArrayList<>());
	}
	
	public List<Document> historyConditionExecve(ConfigLogSesCondVO vo){
		MongoCollection<Document> auditLogListCol = mongoTemplate.getCollection("AUDIT_LOG");
		List<Document> findResultList = new ArrayList<Document>();
		
		BasicDBObject findQuery = new BasicDBObject();
		findQuery.put("body_host_ip", vo.getHostIp());
		findQuery.put("header_message:type", "EXECVE");
		
		String sDate = DateUtil.beforeDateDayUnit(vo.getFileCreateDate(), vo.getBeforeTerm())+" 00:00:00";
		String eDate = DateUtil.afterDateDayUnit(vo.getFileCreateDate(), vo.getAfterTerm())+" 23:59:59";
		findQuery.put("body_event_time", new BasicDBObject("$gte", sDate).append( "$lte" , eDate ) );
		Document sortDoc = new Document();
		sortDoc.put("body_argc", -1);
		List<Document> maxArgcDoc = auditLogListCol.find(findQuery).sort(sortDoc).limit(1).into(new ArrayList<>());
		
		if(maxArgcDoc.size() > 0) {
			List<BasicDBObject> orQueryList = new ArrayList<BasicDBObject>();
			//현재 DB에 a값 최대는 a7까지임
			int maxArgc = Integer.parseInt((String)maxArgcDoc.get(0).get("body_argc"));
			for(int i =0 ; i<maxArgc; i++) {
				String keyName = "body_a"+String.valueOf(i);
				orQueryList.add(new BasicDBObject(keyName,"\""+vo.getFileName()+"\""));
			}
			findQuery.put("$or", orQueryList);

			
			System.out.println(findQuery.toJson());
			findResultList = auditLogListCol.find(findQuery).into(new ArrayList<>());
		}
		
		
		return  findResultList;
	}
	
	public String getSesList(String hostIp, String headerMsg){
		
		MongoCollection<Document> auditLogListCol = mongoTemplate.getCollection("AUDIT_LOG");
		BasicDBObject findQuery = new BasicDBObject();
		findQuery.put("body_host_ip", hostIp);
		findQuery.put("header_message:type", "SYSCALL");
		findQuery.put("header_msg", headerMsg);
		
		Document syscallDoc =  auditLogListCol.find(findQuery).into(new ArrayList<>()).get(0);
		return syscallDoc.getString("body_ses");
		
	}
	
	public List<Document> selectBeforDateAuditLogByConfigLog(ConfigLogHistoryVO vo) {
		MongoCollection<Document> audtiLogListCol = mongoTemplate.getCollection("AUDIT_LOG");
		List<Document> resultList = new ArrayList<Document>();
		
		BasicDBObject findQuery = new BasicDBObject();
		
		String sDate = DateUtil.beforeDateDayUnit(vo.getFileCreateDate(), vo.getBeforeTerm())+" 00:00:00";
		String eDate = DateUtil.afterDateDayUnit(vo.getFileCreateDate(), vo.getAfterTerm())+" 23:59:59";
		
		findQuery.put("body_host_ip", vo.getHostIp());
		findQuery.put("header_message:type", "SYSCALL");
		
		findQuery.put("body_ses", vo.getSes());
		findQuery.put("body_event_time", new BasicDBObject("$gte", sDate).append( "$lte" , eDate ) );
		
		System.out.println("findQuery : "+findQuery.toJson());
		
		Document sortDoc = new Document();
		sortDoc.put("body_event_time", -1);
		List<Document> auditLogList = audtiLogListCol.find(findQuery)
																		  .sort(sortDoc)
																		  .limit(vo.getPageSize())
																	      .skip(vo.getPageNumber()-1)
																		  .into(new ArrayList<>());
		
		for(Document doc : auditLogList) {
			String headerMsg = (String)doc.get("header_msg");
			BasicDBObject headerFindQuery = new BasicDBObject();
			headerFindQuery.put("header_message:type", new BasicDBObject("$ne", "PROCTITLE"));
			headerFindQuery.put("header_msg", headerMsg);
			System.out.println(headerFindQuery.toJson());
			List<Document> resDoc = audtiLogListCol.find(headerFindQuery).into(new ArrayList<>());
			for(Document allDoc : resDoc) {
				resultList.add(allDoc);
			}
		}
		
		System.out.println("auditLog size : " + auditLogList.size());
		return resultList;
		
	}
	
//	public List<Document> selectBeforDateAuditLogByConfigLog(ConfigLogHistoryVO vo) {
//		
//		MongoCollection<Document> audtiLogListCol = mongoTemplate.getCollection("AUDIT_LOG");
//		List<Document> resultList = new ArrayList<Document>();
//	    //month단위
//		
//		BasicDBObject findQuery = new BasicDBObject();
//		findQuery.put("body_host_ip", vo.getHostIp());
//		
//		String beforeStartDate = DateUtil.beforeDateDayUnit(vo.getFileCreateDate(),"0");
//		String startDate = beforeStartDate+" 00:00:00";
//		
//		String endDate = DateUtil.addSecondsDateTime(vo.getFileCreateDate(), 1);
//		
//		findQuery.put("body_name", "\""+vo.getFilePath()+"/"+vo.getFileName()+"\"");
//		findQuery.put("body_event_time", new BasicDBObject("$gte", startDate).append( "$lte" , endDate ) );
//		System.out.println("findQuery : "+findQuery.toJson());
//		
//		Document sortDoc = new Document();
//		sortDoc.put("body_event_time", -1);
//		List<Document> auditLogList = audtiLogListCol.find(findQuery)
//																		  .sort(sortDoc)
//																		  .limit(1)
//																		  .into(new ArrayList<>());
//		
//		if(auditLogList.size()>0) {
//			
//			Document auditLogDoc = auditLogList.get(0);
//			System.out.println(auditLogDoc.get("body_event_time").toString());
//			
//			BasicDBObject headerQuery = new BasicDBObject();
//			headerQuery.put("header_msg", (String)auditLogDoc.get("header_msg"));
//			headerQuery.put("header_message:type", "SYSCALL");
//			Document resultMsg =  audtiLogListCol.find(headerQuery).limit(1).into(new ArrayList<>()).get(0);
//			
//			BasicDBObject auditLogFindQuery = new BasicDBObject();
//			auditLogFindQuery.put("body_host_ip", vo.getHostIp());
//			auditLogFindQuery.put("body_ses", (String)resultMsg.get("body_ses"));
//			
//			String sDate = DateUtil.beforeDateDayUnit(vo.getFileCreateDate(), vo.getBeforeTerm())+" 00:00:00";
//			String eDate = DateUtil.afterDateDayUnit(vo.getFileCreateDate(), vo.getAfterTerm())+" 23:59:59";
//			
//			auditLogFindQuery.put("body_event_time", new BasicDBObject("$gte", sDate).append( "$lte" , eDate ) );
//			System.out.println("auditLogFindQuery : "+auditLogFindQuery.toJson());
//			
//			List<Document> auditLogDocList = audtiLogListCol.find(auditLogFindQuery).into(new ArrayList<>());
//			
//			for(Document auditDoc : auditLogDocList) {
//				
//				BasicDBObject headerMsgQuery = new BasicDBObject();
//				headerMsgQuery.put("header_msg", (String)auditDoc.get("header_msg"));
//				headerMsgQuery.put("header_message:type", new BasicDBObject("$ne", "PROCTITLE"));
//				
//				List<Document> resultByMsgList =  audtiLogListCol.find(headerMsgQuery).into(new ArrayList<>());
//				for(Document doc:resultByMsgList) {
//					resultList.add(doc);
//				}
//				
//			}
//		
//		}
//		System.out.println(resultList.size());
//		return resultList;
//		
//	}
	
}
