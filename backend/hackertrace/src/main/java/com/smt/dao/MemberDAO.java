package com.smt.dao;

import java.util.ArrayList;
import java.util.List;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Repository;

import com.mongodb.BasicDBObject;
import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;
import com.smt.vo.MemberVO;

@Repository
public class MemberDAO {

	@Autowired
	private MongoTemplate mongoTemplate;

	private String colName = "MEMBER";

	public List<Document> findUserId(MemberVO vo) {
		List<Document> list = new ArrayList<Document>();
		MongoCollection<Document> collection = mongoTemplate.getCollection(colName);

		BasicDBObject findQuery = new BasicDBObject("userId", vo.getUserId());
		FindIterable<Document> iterDoc = collection.find(findQuery);
		while (iterDoc.iterator().hasNext()) {
			list.add(iterDoc.iterator().next());
			break;
		}

		return list;
	}

	public void regMember(MemberVO vo) {

		mongoTemplate.save(vo);
	}

}
