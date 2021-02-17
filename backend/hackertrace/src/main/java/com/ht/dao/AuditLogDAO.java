package com.ht.dao;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

import org.apache.commons.lang3.StringUtils;
import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Repository;

import com.ht.util.MogoDBUtil;
import com.ht.vo.AuditLogListVO;
import com.ht.vo.AuditLogVO;
import com.mongodb.BasicDBObject;
import com.mongodb.client.MongoCollection;

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
		
		BasicDBObject findQuery = new BasicDBObject();
		findQuery.put("body_host_ip", vo.getHostIp());
		
		//공격 단계에 맡는 t 목록
		List<String> tValByPhases = mitreADao.selectMitreAttackTValueByPhases(vo.getPhases());
		List<BasicDBObject> keyQueryList = new ArrayList<BasicDBObject>();
		for(String tVal : tValByPhases) {
			keyQueryList.add(new BasicDBObject("body_key", "\""+tVal+"\""));
		}
		
		//OR query
		findQuery.put("$or", keyQueryList);
		
		//LIKE query
		System.out.println(vo.getSearchWord());
		if(StringUtils.isNotEmpty(vo.getSearchWord())) {
			findQuery.put(vo.getSearchType(), Pattern.compile(vo.getSearchWord(), Pattern.CASE_INSENSITIVE) );
		}
		
		findQuery.put("body_event_time", MogoDBUtil.getDateTermFindQuery(vo.getStartDate(), vo.getEndDate()) );
		Document sortDoc = new Document();
		sortDoc.put("body_event_time", -1);
		
		List<Document> docList  = new ArrayList<>();
		System.out.println(findQuery.toJson());
		docList = audtiLogListCol.find(findQuery)
	   						     .sort(sortDoc)
						         .limit(vo.getPageSize())
						         .skip(vo.getPageNumber()-1)
						         .into(new ArrayList<>());
		
		return docList;
		
	}
	
	
	

	
	
}
