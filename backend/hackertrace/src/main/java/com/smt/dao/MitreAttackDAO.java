package com.smt.dao;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Repository;

import com.mongodb.BasicDBObject;
import com.mongodb.client.MongoCollection;
import com.smt.util.MogoDBUtil;
import com.smt.vo.MitreAttackVO;
import com.smt.vo.MitreAuditConditionSesVO;
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
		
		sortMitreExternalIdx(resultDocList);

		return resultDocList; 
		
	}
	
	//일치율에 따른 sorting
	private void sortMitreExternalIdx(List<Document> attackGroupMatchingList) {
		Collections.sort(attackGroupMatchingList, new Comparator<Document>() {
			
			@Override
			public int compare(Document o1, Document o2) {
				List<String> externalIdsO1List = (List<String>) o1.get("external_ids");
				List<String> externalIdsO2List = (List<String>) o2.get("external_ids");
				
				Double exIdO1 = Double.valueOf(externalIdsO1List.get(0).replaceAll("T", ""));
				Double exIdO2 = Double.valueOf(externalIdsO2List.get(0).replaceAll("T", ""));
				  if (exIdO1 < exIdO2 ) {
	                    return -1;
	                } else if (exIdO1> exIdO2) {
	                    return 1;
	                }
	                return 0;
			}

		});
	}
	
//	public Document selectMitreAuditCondition(MitreAuditConditionVO vo){
//		MongoCollection<Document> auditLogCol = mongoTemplate.getCollection("AUDIT_LOG");
//		
//		BasicDBObject dateTermQuery =new BasicDBObject();
//		dateTermQuery.put("body_host_ip", vo.getHostIp());
//		dateTermQuery.put("body_key", new BasicDBObject("$regex", ".*T.*"));
//		dateTermQuery.put("body_event_time", MogoDBUtil.getDateTermFindQuery(vo.getStartDate(), vo.getEndDate()) );
//		
//		Document resultDoc = new Document();
//		 
//		List<BasicDBObject> uidSesQueryList = new ArrayList<BasicDBObject>();
//		
//		System.out.println(dateTermQuery.toJson());
//		BasicDBObject matchQuery = new BasicDBObject("$match", dateTermQuery);
//		BasicDBObject sesUidQuery = new BasicDBObject();
//		sesUidQuery.put("v1", "$body_uid");
//		sesUidQuery.put("v2", "$body_ses");
//		BasicDBObject uidQuery = new BasicDBObject("$group", new BasicDBObject("_id",sesUidQuery));
//		
//		uidSesQueryList.add(matchQuery);
//		uidSesQueryList.add(uidQuery);
//		
//		System.out.println(uidSesQueryList.toString());
//		List<Document> uidSesList = auditLogCol.aggregate(uidSesQueryList).into(new ArrayList<>());
//		List<String> uidList = new ArrayList<String>();
//		List<String> sesList = new ArrayList<String>();
//		for(Document doc : uidSesList) {
//			Document resDoc = new Document();
//			resDoc = (Document) doc.get("_id");
//			System.out.println(resDoc.toJson());
////			if(doc.get("_id") != null) {
////				uidList.add((String)doc.get("_id"));
////			}
//		}
		
//		resultDoc.put("uid_list", uidList);
		
//		return resultDoc;
		
//	}
	
	public Document selectMitreAuditConditionUid(MitreAuditConditionVO vo){
		MongoCollection<Document> auditLogUidSesCol = mongoTemplate.getCollection("AUDIT_LOG_UID_SES");
		
		BasicDBObject matchConditionQuery =new BasicDBObject();
		matchConditionQuery.put("createDate", new BasicDBObject("$gte", vo.getStartDate()).append( "$lte" , vo.getEndDate()));
		matchConditionQuery.put("hostIp", vo.getHostIp());
		
		BasicDBObject matchQuery = new BasicDBObject("$match", matchConditionQuery);
		BasicDBObject groupQuery = new BasicDBObject("$group", new BasicDBObject("_id", "$uid"));
		
		List<BasicDBObject> getOnlyUidQueryList = new ArrayList<BasicDBObject>();
		getOnlyUidQueryList.add(matchQuery);
		getOnlyUidQueryList.add(groupQuery);
		
		List<Document> uidDocList = auditLogUidSesCol.aggregate(getOnlyUidQueryList).into(new ArrayList<>());
		List<String> uidListResult = new ArrayList<String>();
		for(Document doc : uidDocList) {
			uidListResult.add((String)doc.get("_id"));
		}
		
		Document resultDoc = new Document();
		resultDoc.put("uid_list", uidListResult);
		
		return resultDoc;
		
	}
	
	public Document selectMitreAuditConditionSes(MitreAuditConditionSesVO vo){
		MongoCollection<Document> auditLogUidSesCol = mongoTemplate.getCollection("AUDIT_LOG_UID_SES");
		
		BasicDBObject matchConditionQuery =new BasicDBObject();
		matchConditionQuery.put("createDate", new BasicDBObject("$gte", vo.getStartDate()).append( "$lte" , vo.getEndDate()));
		matchConditionQuery.put("hostIp", vo.getHostIp());
		matchConditionQuery.put("uid", vo.getUid());
		
		BasicDBObject matchQuery = new BasicDBObject("$match", matchConditionQuery);
		BasicDBObject groupQuery = new BasicDBObject("$group", new BasicDBObject("_id", "$ses"));
		
		List<BasicDBObject> getOnlySesQueryList = new ArrayList<BasicDBObject>();
		getOnlySesQueryList.add(matchQuery);
		getOnlySesQueryList.add(groupQuery);
		
		List<Document> sesDocList = auditLogUidSesCol.aggregate(getOnlySesQueryList).into(new ArrayList<>());
		List<String> sesListResult = new ArrayList<String>();
		for(Document doc : sesDocList) {
			sesListResult = (List<String>) doc.get("_id");
		}
		
		Document resultDoc = new Document();
		resultDoc.put("ses_list", sesListResult);
		
		return resultDoc;
		
	}

//	private void getGroupResults(List<Document> docList, List<String> idValList) {
//		
//		for(Document doc : docList) {
//			String idVal = String.valueOf(doc.get("_id"));
//			if(idVal != "null") 
//				idValList.add(idVal);
//		}
//		
//	}
	
	public List<Document> selectUserAuditLogList(MitreAuditVO vo){
		
		MongoCollection<Document> auditLogCol = mongoTemplate.getCollection("AUDIT_LOG");
		
		BasicDBObject findQuery = new BasicDBObject();
		
		findQuery.put("body_host_ip", vo.getHostIp());
		findQuery.put("body_uid", vo.getUid());
		findQuery.put("body_ses", vo.getSes());
		findQuery.put("body_key", new BasicDBObject("$regex", ".*T.*"));
		findQuery.put("body_event_time", MogoDBUtil.getDateTermFindQuery(vo.getStartDate(), vo.getEndDate()) );
		System.out.println(findQuery);
		
		return auditLogCol.find(findQuery).into(new ArrayList<>());
	}
	
	public List<String> selectUserAuditLogOnlyTList(MitreAuditVO vo){
		List<String> result = new ArrayList<String>();
		
		MongoCollection<Document> auditLogCol = mongoTemplate.getCollection("AUDIT_LOG");
		
		BasicDBObject matchQuery = new BasicDBObject();
		
		matchQuery.put("body_host_ip", vo.getHostIp());
		matchQuery.put("body_uid", vo.getUid());
		matchQuery.put("body_ses", vo.getSes());
		matchQuery.put("body_key", new BasicDBObject("$regex", ".*T.*"));
		matchQuery.put("body_event_time", MogoDBUtil.getDateTermFindQuery(vo.getStartDate(), vo.getEndDate()) );
		
		BasicDBObject groupQuery = new BasicDBObject("_id", "$body_key");
		
		List<BasicDBObject> aggregateQuery = new ArrayList<>();
		aggregateQuery.add(new BasicDBObject("$match", matchQuery));
		aggregateQuery.add(new BasicDBObject("$group", groupQuery));
		
		System.out.println(aggregateQuery.toString());
		List<Document> docList = auditLogCol.aggregate(aggregateQuery).into(new ArrayList<>());
		for(Document doc : docList) {
			result.add(doc.getString("_id").replaceAll("\\\"", ""));
		}
		
		return result;
		
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
		
		result.put("attack_group_name", attackGroupName);
		result.put("attack_group_external_ids", tList);
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
			
			if(platforms.contains("Linux")) 
				tList.add(externalIds.get(0));
			
		}
		
		return tList.stream().distinct().collect(Collectors.toList());
		
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
