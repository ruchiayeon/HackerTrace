package com.smt.dao;

import java.util.ArrayList;
import java.util.List;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Repository;

import com.mongodb.BasicDBObject;
import com.mongodb.client.MongoCollection;
import com.smt.vo.LoginVO;

@Repository
public class LoginDAO {
	
	@Autowired
	private MongoTemplate mongoTemplate;
	
	public Document findUserInfoByUserId(LoginVO vo) {
		
		MongoCollection<Document> memCol = mongoTemplate.getCollection("MEMBER");

		BasicDBObject findQuery = new BasicDBObject("userId", vo.getUserId());
		
		System.out.println(findQuery.toJson());
		List<Document> docList = memCol.find(findQuery)
														 .into(new ArrayList<>());
		
		return docList.size()<1?null:docList.get(0);
	}

}
