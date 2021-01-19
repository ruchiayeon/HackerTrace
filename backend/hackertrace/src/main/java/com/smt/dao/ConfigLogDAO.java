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
import com.smt.vo.ConfigLogHistoryVO;
import com.smt.vo.ConfigLogListVO;
import com.smt.vo.ConfigLogSessionsVO;
import com.smt.vo.ConfigLogVO;
import com.smt.vo.ConfigOriginVO;

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
	
	public List<Document> selectConfigOriginFilePath(){
		MongoCollection<Document> configFilesOriginListCol = mongoTemplate.getCollection("CONFIG_FILES_ORIGIN");
		
		//GROUP BY
		List<BasicDBObject> filePathQueryList = new ArrayList<BasicDBObject>();
		BasicDBObject groupFilePathQuery = new BasicDBObject("$group", new BasicDBObject("_id", "$filePath"));
		filePathQueryList.add(groupFilePathQuery);
		
		return configFilesOriginListCol.aggregate(filePathQueryList).into(new ArrayList<>());
	}
	
	public List<Document> selectConfigLogFileList(ConfigLogListVO vo){
		
		MongoCollection<Document> configFilesLogsListCol = mongoTemplate.getCollection("CONFIG_FILES_LOGS");
		
		BasicDBObject findQuery = MogoDBUtil.getDateTermFindQuery("fileCreateDate", vo.getStartDate(), vo.getEndDate());
		findQuery.put("hostIp", vo.getHostIp());
		findQuery.put("filePath", vo.getFilePath());
		
		//LIKE query 
		if(vo.getSearchType() != "") {
			
			//TODO:BUG.OR쿼리 사용 시 LIKE 쿼리 안먹힘 
			if(vo.getSearchType().equalsIgnoreCase("ALL")) {
				List<BasicDBObject> searchQueryList = new ArrayList<BasicDBObject>();
				searchQueryList.add(new BasicDBObject("fileName", vo.getSearchWord()));
				searchQueryList.add(new BasicDBObject("uid", vo.getSearchWord()));
				searchQueryList.add(new BasicDBObject("fileCreateDate", vo.getSearchWord()));
				findQuery.put("$or", searchQueryList);
			}else { //전체 검색 조건
				findQuery.put(vo.getSearchType(), Pattern.compile(vo.getSearchWord(), Pattern.CASE_INSENSITIVE));
			}
			
		}
		
		System.out.println(findQuery.toJson());

		return configFilesLogsListCol.find(findQuery)
				 .limit(vo.getPageSize())
				 .skip(vo.getPageNumber()-1)
				 .into(new ArrayList<>());
	}
	
	public Document selectConfigOriginLogFileContents(ConfigOriginVO vo){
		
		Document result = new Document();
		
		MongoCollection<Document> configFilesOriginListCol = mongoTemplate.getCollection("CONFIG_FILES_ORIGIN");
		
		
		BasicDBObject findQuery = new BasicDBObject("hostIp", vo.getHostIp());
		findQuery.put("uid", vo.getUid());
		findQuery.put("filePath", vo.getFilePath());
		findQuery.put("fileName", vo.getFileName());
		
		System.out.println(findQuery.toJson());
		List<Document> docList =  configFilesOriginListCol.find(findQuery).into(new ArrayList<>());
		
		result.put("origin_config_file_contents", docList.size()<1?"":docList.get(0));
		
		MongoCollection<Document> configFilesLogListCol = mongoTemplate.getCollection("CONFIG_FILES_LOGS");
		BasicDBObject logFindQuery = new BasicDBObject("_id", new ObjectId(vo.getLogObjId()) );
		System.out.println(logFindQuery.toJson());
		
		List<Document> docLogList =  configFilesLogListCol.find(logFindQuery).into(new ArrayList<>());
		
		result.put("log_config_file_contents", docLogList.size()<1?"":docLogList.get(0));
		
		return result;
		
	}
	
	public List<Document> selectBefroDateAuditLogSessionList(ConfigLogSessionsVO vo){
		
		MongoCollection<Document> audtiLogListCol = mongoTemplate.getCollection("AUDIT_LOG");
	    
	    String beforeEndDate = DateUtil.beforDateMonthUnit(vo.getFileCreateDate(), vo.getTerm());
	    BasicDBObject findQuery = MogoDBUtil.getDateTermFindQuery("header.time", beforeEndDate, vo.getFileCreateDate());
		findQuery.put("header.hostIp", vo.getHostIp());
		findQuery.put("body.uid", vo.getUid());
		
		BasicDBObject matchQuery = new BasicDBObject("$match", findQuery);
		BasicDBObject groupQuery = new BasicDBObject("$group", new BasicDBObject("_id", "$body.ses"));
		
		System.out.println(matchQuery.toJson());
		System.out.println(groupQuery.toJson());
		
		List<BasicDBObject> aggregateList = new ArrayList<BasicDBObject>();
		aggregateList.add(matchQuery);
		aggregateList.add(groupQuery);
		
		return audtiLogListCol.aggregate(aggregateList).into(new ArrayList<>());
		
	}
	
	public List<Document> selectBeforDateAuditLogByConfigLog(ConfigLogHistoryVO vo) {
		
		MongoCollection<Document> audtiLogListCol = mongoTemplate.getCollection("AUDIT_LOG");
		
	    //month단위
	    String beforeEndDate = DateUtil.beforDateMonthUnit(vo.getFileCreateDate(), vo.getTerm());
		
		BasicDBObject findQuery = MogoDBUtil.getDateTermFindQuery("header.time", beforeEndDate, vo.getFileCreateDate());
		findQuery.put("header.hostIp", vo.getHostIp());
		findQuery.put("body.uid", vo.getUid());
		findQuery.put("body.ses", vo.getSes());
		
		if(!vo.getIsAll().equalsIgnoreCase("T")) {
			findQuery.put("body.name", Pattern.compile(vo.getFileName(), Pattern.CASE_INSENSITIVE ));
		}
		
		System.out.println(findQuery.toJson());
		return audtiLogListCol.find(findQuery).into(new ArrayList<>());
		
	}
	
}
