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
import com.smt.vo.ConfigLogHistoryVO;
import com.smt.vo.ConfigLogListVO;
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
		
		findQuery.put("fileCreateDate", MogoDBUtil.getDateTermFindQuery(vo.getStartDate(), vo.getEndDate()) );
		System.out.println(findQuery.toJson());

		return configFilesLogsListCol.find(findQuery)
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
	
	public List<Document> selectBeforDateAuditLogByConfigLog(ConfigLogHistoryVO vo) {
		
		MongoCollection<Document> audtiLogListCol = mongoTemplate.getCollection("AUDIT_LOG");
		List<Document> resultList = new ArrayList<Document>();
	    //month단위
	    String beforeEndDate = DateUtil.beforDateDayUnit(vo.getFileCreateDate(), vo.getTerm());
		
		BasicDBObject findQuery = new BasicDBObject();
		findQuery.put("body_host_ip", vo.getHostIp());
		
		String startDate = beforeEndDate+" 00:00:00";
		String endDate = vo.getFileCreateDate();
		
		findQuery.put("body_event_time", new BasicDBObject("$gte", startDate).append( "$lte" , endDate ) );
//		if(vo.getIsOnlyFileNameAuditLog().equalsIgnoreCase("Y"))
		findQuery.put("body_name", "\""+vo.getFilePath()+"/"+vo.getFileName()+"\"");
		
		System.out.println(findQuery.toJson());
		List<Document> auditLogDocList =  audtiLogListCol.find(findQuery).into(new ArrayList<>());
		for(Document auditDoc : auditLogDocList) {
			BasicDBObject headerMsgQuery = new BasicDBObject("header_msg", (String)auditDoc.get("header_msg"));
			headerMsgQuery.put("header_message:type", "SYSCALL");
			Document resultByMsg =  audtiLogListCol.find(headerMsgQuery).into(new ArrayList<>()).get(0);
			
			resultList.add(auditDoc);
			resultList.add(resultByMsg);
		}
		
		return resultList;
		
	}
	
}
