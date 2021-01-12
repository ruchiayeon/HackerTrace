package com.smt.dao;

import java.util.ArrayList;
import java.util.List;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Repository;

import com.mongodb.BasicDBObject;
import com.mongodb.client.MongoCollection;
import com.smt.vo.HostsVO;

@Repository
public class HostsDAO {

	@Autowired
	private MongoTemplate mongoTemplate;

	

	public void dropHostsColleciton() {
		mongoTemplate.dropCollection("HOSTS");
	}

	public void insertHosts(HostsVO vo) {
		mongoTemplate.insert(vo, "HOSTS");
	}

	public int countHostsByUserIp(HostsVO vo) {
		MongoCollection<Document> hostsCol = mongoTemplate.getCollection("HOSTS");
		BasicDBObject findQuery = new BasicDBObject("hostIp", vo.getHostIp());
		long hostCount = hostsCol.countDocuments(findQuery);

		return (int) hostCount;
	}

	public List<Document> getAllSavedHostsList() {
		MongoCollection<Document> hostsCol = mongoTemplate.getCollection("HOSTS");
		BasicDBObject findQuery = new BasicDBObject();
		return hostsCol.find(findQuery).into(new ArrayList<>());
	}

}
