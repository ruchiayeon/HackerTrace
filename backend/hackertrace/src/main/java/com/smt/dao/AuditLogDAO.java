package com.smt.dao;

import java.util.ArrayList;
import java.util.List;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Repository;

import com.mongodb.BasicDBObject;
import com.mongodb.client.MongoCollection;
import com.smt.vo.AuditLogListVO;
import com.smt.vo.AuditLogVO;

@Repository
public class AuditLogDAO {

	@Autowired
	private MongoTemplate mongoTemplate;
	
	public void dropAuditLogColleciton() {
		mongoTemplate.dropCollection("AUDIT_LOG");
	}
	
	public void insertAuditLog(AuditLogVO vo) {
		mongoTemplate.insert(vo, "AUDIT_LOG");
	}
	
	public List<Document> getAuditLogList(AuditLogListVO param){
		
		MongoCollection<Document> audtiLogListCol = mongoTemplate.getCollection("AUDIT_LOG");
		
		List<Document> docList;
		
		BasicDBObject findQuery;
		if(param.getIsTech().equals("T")) {
			findQuery = new BasicDBObject("key", new BasicDBObject("$regex", "T.*"));
		}else {
			findQuery = new BasicDBObject();
		}
		
		docList = audtiLogListCol.find(findQuery)
					  .limit(param.getPageSize())
					  .skip(param.getPageNumber())
					  .into(new ArrayList<>());
		
		return docList;
		
	}
	
	
}
