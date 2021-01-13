package com.smt.dao;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Repository;

import com.mongodb.BasicDBObject;
import com.mongodb.client.MongoCollection;
import com.smt.util.MogoDBUtil;
import com.smt.vo.ConfigLogListVO;
import com.smt.vo.ConfigLogVO;

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
	
//	public List<Document> selectAllConfigOriginFile(){
//		MongoCollection<Document> configFilesOriginListCol = mongoTemplate.getCollection("CONFIG_FILES_ORIGIN");
//		BasicDBObject findQuery = new BasicDBObject();
//		List<Document> docList =  configFilesOriginListCol.find(findQuery).into(new ArrayList<>());
//
//		return docList;
//	}
	
	public List<Document> selectConfigLogFileList(ConfigLogListVO vo){
		
		MongoCollection<Document> configFilesOriginListCol = mongoTemplate.getCollection("CONFIG_FILES_LOGS");
		
		BasicDBObject findQuery = MogoDBUtil.getDateTermFindQuery("fileCreateDate", vo.getStartDate(), vo.getEndDate());
		findQuery.put("hostIp", vo.getHostIp());
		findQuery.put("filePath", vo.getFilePath());
		
		//LIKE query 
		try {
			int searchWordNum = Integer.parseInt(vo.getSearchWord()); //검색어가 정수라면
			findQuery.put(vo.getSearchType(), searchWordNum);
		}catch(Exception e) {
			findQuery.put(vo.getSearchType(), Pattern.compile(vo.getSearchWord(), Pattern.CASE_INSENSITIVE));
		}
		
		System.out.println(findQuery.toJson());
		List<Document> docList =  configFilesOriginListCol.find(findQuery)
											  .limit(vo.getPageSize())
											  .skip(vo.getPageNumber()-1)
											  .into(new ArrayList<>());

		return docList;
	}
	
}
