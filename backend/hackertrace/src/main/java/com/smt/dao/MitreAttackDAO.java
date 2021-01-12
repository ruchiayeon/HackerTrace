package com.smt.dao;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

import org.bson.Document;
import org.bson.conversions.Bson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Repository;

import com.mongodb.BasicDBObject;
import com.mongodb.client.MongoCollection;
import com.smt.vo.MitreAttackVO;
import com.smt.vo.MitreAuditVO;

@Repository
public class MitreAttackDAO {

	@Autowired
	private MongoTemplate mongoTemplate;
	
	public void deleteMitreAttackInfo() {
		mongoTemplate.dropCollection("MITRE_ATTACK");
	}

	public void insertMitreAttackInfo(MitreAttackVO vo)  {
		Document doc = new Document();
		doc.put("name", vo.getName());
		doc.put("description", vo.getDescription());
		doc.put("external_ids", vo.getExternalIds());
		doc.put("kill_chain_phases", vo.getKillChainPhases());
		doc.put("platforms", vo.getPlatforms());
		mongoTemplate.insert(doc, "MITRE_ATTACK");
	}
	
	public List<Document> getMitreInfoByKillChainPhase(String phases, String isSubT){
		MongoCollection<Document> mitreAttackCol = mongoTemplate.getCollection("MITRE_ATTACK");
		
		BasicDBObject findQuery = new BasicDBObject("kill_chain_phases", phases);
		List<Document> docList = mitreAttackCol.find(findQuery).into(new ArrayList<>());
		List<Document> resultDocList = new ArrayList<>();
		for(Document doc : docList ) {
			doc.remove("platforms");
			doc.remove("_id");
			doc.remove("kill_chain_phases");
			
			if(isSubT.equals("F")) {
				List<String> externalIds = (List<String>) doc.get("external_ids");
				if(externalIds.get(0).split("\\.").length>1)
					continue;
			}
			
			resultDocList.add(doc);
		}

		return resultDocList; 
		
	}
	
	public List<Document> selectMitreAuditList(MitreAuditVO vo){
		
		MongoCollection<Document> auditLogCol = mongoTemplate.getCollection("AUDIT_LOG");
		
		String startDate = vo.getStartDate()+" 00:00:00";
		String endDate = vo.getEndDate()+" 23:59:59";
		
		BasicDBObject findQuery = new BasicDBObject("time"
				, new BasicDBObject("$gte", startDate)
				.append( "$lte" , endDate ) );
		
		findQuery.put("hostIp", vo.getHostIp());
		findQuery.put("uid", Integer.parseInt(vo.getUid()));
		findQuery.put("ses", vo.getSes());
		findQuery.put("key", new BasicDBObject("$regex", "T.*"));
		
		List<Document> docList = auditLogCol.find(findQuery)
//												.limit(vo.getPageSize())
//												.skip(vo.getPageNumber()-1)
												.into(new ArrayList<>());
		
		return docList;
	}
	
	public List<Document> selectAttackGroupList(){
		
		MongoCollection<Document> mitreAttackGroup = mongoTemplate.getCollection("MITRE_ATTACK_GROUP");
		List<BasicDBObject> aggregateList = new ArrayList<BasicDBObject>();
		BasicDBObject aggregateQuery = new BasicDBObject("$group", new BasicDBObject("_id", "$attack_group") );
		aggregateList.add(aggregateQuery);
		return mitreAttackGroup.aggregate(aggregateList).into(new ArrayList<>());
	}
	
	public Document selectTValueByGroupName(String attackGroupName){
		MongoCollection<Document> mitreAttackGroup = mongoTemplate.getCollection("MITRE_ATTACK_GROUP");
		Document result = new Document();
		BasicDBObject findQuery = new BasicDBObject("attack_group", attackGroupName);
		List<Document> docList = mitreAttackGroup.find(findQuery)
				.into(new ArrayList<>());
		
		List<String> tList = new ArrayList<String>();
		for(Document doc : docList) {
			tList.add(doc.getString("external_id"));
		}
		result.put("attack_group", attackGroupName);
		result.put("external_ids", tList);
		return result;
	}
	
	public List<String> selectMitreAttackMatrixTList(){
		List<String> tList = new ArrayList<String>();
		MongoCollection<Document> mitreAttackCol = mongoTemplate.getCollection("MITRE_ATTACK");
		BasicDBObject findQuery = new BasicDBObject();
		List<Document> docList = mitreAttackCol.find(findQuery).into(new ArrayList<>());
		for(Document doc : docList) {
			List<String> externalIds = (List<String>) doc.get("external_ids");
			List<String> platforms = (List<String>) doc.get("platforms");
			if(platforms.contains("Linux")) {
				tList.add(externalIds.get(0));
			}
		}
		
		tList.stream().distinct();
		
		return tList;
		
	}
	

}
