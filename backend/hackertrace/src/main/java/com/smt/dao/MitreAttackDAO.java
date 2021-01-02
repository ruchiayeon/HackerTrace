package com.smt.dao;

import java.util.ArrayList;
import java.util.List;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Repository;

import com.mongodb.BasicDBObject;
import com.mongodb.client.MongoCollection;
import com.smt.vo.MitreAttackVO;

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

}
