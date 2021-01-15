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
import com.smt.vo.AuditLogListVO;
import com.smt.vo.AuditLogVO;

@Repository
public class AuditLogDAO {

	@Autowired
	private MongoTemplate mongoTemplate;
	
	@Autowired
	private MitreAttackDAO mitreADao;
	
	public void dropAuditLogCollection() {
		mongoTemplate.dropCollection("AUDIT_LOG");
	}
	
	public void insertAuditLog(AuditLogVO vo) {
		mongoTemplate.insert(vo, "AUDIT_LOG");
	}
	
	public List<Document> getAuditLogList(AuditLogListVO vo){
		
		MongoCollection<Document> audtiLogListCol = mongoTemplate.getCollection("AUDIT_LOG");
		
		BasicDBObject findQuery = MogoDBUtil.getDateTermFindQuery("time", vo.getStartDate(), vo.getEndDate());
		findQuery.put("hostIp", vo.getHostIp());
		
		//공격 단계에 맡는 t 목록
		List<String> tValByPhases = mitreADao.selectMitreAttackTValueByPhases(vo.getPhases());
		List<BasicDBObject> keyQueryList = new ArrayList<>();
		for(String t : tValByPhases) {
			keyQueryList.add(new BasicDBObject("key", t));
		}
		
		//OR query
		findQuery.put("$or", keyQueryList);
		//LIKE query
		if(vo.getSearchType() != "") {
			findQuery.put(vo.getSearchType(), Pattern.compile(vo.getSearchWord(), Pattern.CASE_INSENSITIVE) );
		}
		
		System.out.println(findQuery.toJson());
		List<Document> docList = audtiLogListCol.find(findQuery)
																     .limit(vo.getPageSize())
																     .skip(vo.getPageNumber()-1)
																     .into(new ArrayList<>());
		
		return docList;
		
	}
	

	
	
}