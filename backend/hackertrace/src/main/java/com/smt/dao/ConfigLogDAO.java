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
import com.smt.util.MogoDBUtil;
import com.smt.vo.ConfigLogListVO;
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
		List<Document> docList =  configFilesOriginListCol.find(findQuery)
																				  .into(new ArrayList<>());
		
		return docList;
	}
	
	public void insertConfigOrginFile(ConfigLogVO vo) {
		mongoTemplate.insert(vo, "CONFIG_FILES_ORIGIN");
	}
	
	public void insertConfigLogFile(ConfigLogVO vo) {
		mongoTemplate.insert(vo, "CONFIG_FILES_LOGS");
	}
	
	public List<Document> selectConfigOriginFilePath(){
		MongoCollection<Document> configFilesOriginListCol = mongoTemplate.getCollection("CONFIG_FILES_ORIGIN");
		List<BasicDBObject> filePathQueryList = new ArrayList<BasicDBObject>();
		BasicDBObject groupFilePathQuery = new BasicDBObject("$group", new BasicDBObject("_id", "$filePath"));
		filePathQueryList.add(groupFilePathQuery);
		List<Document> docList =  configFilesOriginListCol.aggregate(filePathQueryList).into(new ArrayList<>());
		return docList;
	}
	
	public List<Document> selectConfigLogFileList(ConfigLogListVO vo){
		
		MongoCollection<Document> configFilesLogsListCol = mongoTemplate.getCollection("CONFIG_FILES_LOGS");
		
		BasicDBObject findQuery = MogoDBUtil.getDateTermFindQuery("fileCreateDate", vo.getStartDate(), vo.getEndDate());
		findQuery.put("hostIp", vo.getHostIp());
		findQuery.put("filePath", vo.getFilePath());
		
		//LIKE query 
		if(vo.getSearchType() != "") {
			try {
				int searchWordNum = Integer.parseInt(vo.getSearchWord()); //검색어가 정수라면
				findQuery.put(vo.getSearchType(), searchWordNum);
			}catch(Exception e) {
				findQuery.put(vo.getSearchType(), Pattern.compile(vo.getSearchWord(), Pattern.CASE_INSENSITIVE));
			}
		}
		
		System.out.println(findQuery.toJson());
		List<Document> docList =  configFilesLogsListCol.find(findQuery)
																				  .limit(vo.getPageSize())
																				  .skip(vo.getPageNumber()-1)
																				  .into(new ArrayList<>());

		return docList;
	}
	
	public Document selectConfigOriginLogFileContents(ConfigOriginVO vo){
		
		Document result = new Document();
		
		MongoCollection<Document> configFilesOriginListCol = mongoTemplate.getCollection("CONFIG_FILES_ORIGIN");
		
		
		BasicDBObject findQuery = new BasicDBObject("hostIp", vo.getHostIp());
		findQuery.put("uid", vo.getUid());
		findQuery.put("filePath", vo.getFilePath());
		findQuery.put("fileName", vo.getFileName());
		
		System.out.println(findQuery.toJson());
		List<Document> docList =  configFilesOriginListCol.find(findQuery)
				  .into(new ArrayList<>());
		
		result.put("origin_config_file_contents", docList.size()<1?"":docList.get(0));
		
		MongoCollection<Document> configFilesLogListCol = mongoTemplate.getCollection("CONFIG_FILES_LOGS");
		BasicDBObject logFindQuery = new BasicDBObject("_id", new ObjectId(vo.getLogObjId()) );
		System.out.println(logFindQuery.toJson());
		
		List<Document> docLogList =  configFilesLogListCol.find(logFindQuery)
				  								.into(new ArrayList<>());
		
		result.put("log_config_file_contents", docLogList.size()<1?"":docLogList.get(0));
		
		return result;
		
	}
	
}
