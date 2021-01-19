package com.smt.dao;

import java.util.ArrayList;
import java.util.List;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Repository;

import com.mongodb.BasicDBObject;
import com.mongodb.client.MongoCollection;
import com.smt.util.MogoDBUtil;
import com.smt.vo.MitreAttackVO;
import com.smt.vo.MitreAuditConditionVO;
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
				List<String> externalIdsList = (List<String>) doc.get("external_ids");
				if(externalIdsList.get(0).split("\\.").length>1)
					continue;
			}
			
			resultDocList.add(doc);
			
		}

		return resultDocList; 
		
	}
	
	public Document selectMitreAuditCondition(MitreAuditConditionVO vo){
		MongoCollection<Document> auditLogCol = mongoTemplate.getCollection("AUDIT_LOG");
		
		BasicDBObject dateTermQuery = MogoDBUtil.getDateTermFindQuery("header.time", vo.getStartDate(), vo.getEndDate());
		dateTermQuery.put("header.hostIp", vo.getHostIp());
		 
		List<BasicDBObject> uidQueryList = new ArrayList<BasicDBObject>();
		List<BasicDBObject> sesQueryList = new ArrayList<BasicDBObject>();
		
		System.out.println(dateTermQuery.toJson());
		BasicDBObject matchQuery = new BasicDBObject("$match", dateTermQuery);
		
		BasicDBObject groupUidQuery = new BasicDBObject("$group", new BasicDBObject("_id", "$uid"));
		BasicDBObject groupSesQuery = new BasicDBObject("$group", new BasicDBObject("_id", "$ses"));
		
		uidQueryList.add(matchQuery);
		uidQueryList.add(groupUidQuery);
		
		sesQueryList.add(matchQuery);
		sesQueryList.add(groupSesQuery);
		
		List<Document> uidList = auditLogCol.aggregate(uidQueryList).into(new ArrayList<>());
		List<String> uids = new ArrayList<>();
		getGroupResults(uidList, uids);
		
		List<Document> sesList = auditLogCol.aggregate(sesQueryList).into(new ArrayList<>());
		List<String> sess = new ArrayList<>();
		getGroupResults(sesList, sess);
		
		Document resultDoc = new Document();
		resultDoc.put("uid_list", uids);
		resultDoc.put("ses_list", sess);
		
		return resultDoc;
		
	}

	private void getGroupResults(List<Document> docList, List<String> idValList) {
		
		for(Document doc : docList) {
			String idVal = String.valueOf(doc.get("_id"));
			if(idVal != "null") 
				idValList.add(idVal);
		}
		
	}
	
	public List<Document> selectUserAuditLogList(MitreAuditVO vo){
		
		MongoCollection<Document> auditLogCol = mongoTemplate.getCollection("AUDIT_LOG");
		
		BasicDBObject findQuery = MogoDBUtil.getDateTermFindQuery("header.time",vo.getStartDate(), vo.getEndDate());
		
		findQuery.put("header.hostIp", vo.getHostIp());
		findQuery.put("body.uid", vo.getUid());
		findQuery.put("body.ses", vo.getSes());
		findQuery.put("body.key", new BasicDBObject("$regex", "T*"));
		System.out.println(findQuery);
		
		return auditLogCol.find(findQuery).into(new ArrayList<>());
	}

	
	
	public List<Document> selectAttackGroupList(){
		
		MongoCollection<Document> mitreAttackGroup = mongoTemplate.getCollection("MITRE_ATTACK_GROUP");
		
		//GROUP BY
		List<BasicDBObject> aggregateList = new ArrayList<BasicDBObject>();
		BasicDBObject aggregateQuery = new BasicDBObject("$group", new BasicDBObject("_id", "$attack_group") );
		aggregateList.add(aggregateQuery);
		
		return mitreAttackGroup.aggregate(aggregateList).into(new ArrayList<>());
		
	}
	
	public Document selectTValueByGroupName(String attackGroupName){
		
		MongoCollection<Document> mitreAttackGroup = mongoTemplate.getCollection("MITRE_ATTACK_GROUP");
		
		Document result = new Document();
		BasicDBObject findQuery = new BasicDBObject("attack_group", attackGroupName);
		List<Document> docList = mitreAttackGroup.find(findQuery).into(new ArrayList<>());
		
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
	
	//메트릭스에서 공격 단계 정보 -> 해당 t목록 return
	public List<String> selectMitreAttackTValueByPhases(String phases){
		
		List<String> tValByPhases = new ArrayList<String>();
		MongoCollection<Document> mitreAttackCol = mongoTemplate.getCollection("MITRE_ATTACK");
		
		//IN QUERY
		BasicDBObject findQuery = new BasicDBObject();
		String[] platformsArr = {"Linux"};
		String[] phasesArr = {phases};
		findQuery.put("platforms", new BasicDBObject("$in", platformsArr ));
		findQuery.put("kill_chain_phases", new BasicDBObject("$in", phasesArr));
		
		System.out.println(findQuery.toJson());
		List<Document> docList = mitreAttackCol.find(findQuery).into(new ArrayList<>());
		for(Document doc:docList) {
			List<String> tValArr = (List<String>) doc.get("external_ids");
			tValByPhases.add(tValArr.get(0));
		}
		
		return tValByPhases;
	}
	
	public Document getKillChainPhaseByT(String tVal) {
		MongoCollection<Document> mitreAttackCol = mongoTemplate.getCollection("MITRE_ATTACK");
		
		BasicDBObject findQuery = new BasicDBObject();
		String[] tArr = {tVal};
		findQuery.put("external_ids", new BasicDBObject("$in", tArr));
		
		System.out.println(findQuery.toJson());
		List<Document> docList = mitreAttackCol.find(findQuery).into(new ArrayList<>());
		
		return (docList.size()<1)?null:docList.get(0);
		
	}

	

}
