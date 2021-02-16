package com.ht.dao;

import java.util.ArrayList;
import java.util.List;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Repository;

import com.ht.vo.MemberVO;
import com.mongodb.BasicDBObject;
import com.mongodb.client.MongoCollection;

@Repository
public class MemberDAO {

	@Autowired
	private MongoTemplate mongoTemplate;
	
	public List<Document> findUserId(MemberVO vo) {
		MongoCollection<Document> memCol = mongoTemplate.getCollection("MEMBER");

		BasicDBObject findQuery = new BasicDBObject("userId", vo.getUserId());
		
		System.out.println(findQuery.toJson());
		List<Document> docList = memCol.find(findQuery)
														   .into(new ArrayList<>());

		return docList;
	}

	public void regMember(MemberVO vo) {
		MongoCollection<Document> memCol = mongoTemplate.getCollection("MEMBER");
		
		Document doc = new Document();
		doc.put("userId", vo.getUserId());
		doc.put("password", vo.getPassword());
		memCol.insertOne(doc);
	}

}
