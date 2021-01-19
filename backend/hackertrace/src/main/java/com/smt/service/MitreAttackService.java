package com.smt.service;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonIOException;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.google.gson.JsonSyntaxException;
import com.smt.dao.MitreAttackDAO;
import com.smt.util.KillChainPhases;
import com.smt.vo.MitreAttackVO;
import com.smt.vo.MitreAuditConditionVO;
import com.smt.vo.MitreAuditVO;

@Service
public class MitreAttackService {

	@Autowired
	MitreAttackDAO dao;

	public void saveMitreAttackInFile(String path) {

		JsonObject jsonobject = new JsonObject();
		JsonParser jsonParser = new JsonParser();

		try {
			dao.deleteMitreAttackInfo();
			JsonElement element = jsonParser.parse(new FileReader(path));

			jsonobject = element.getAsJsonObject();
			JsonArray objArray = (JsonArray) jsonobject.get("objects");

			for (JsonElement jObj : objArray) {

				JsonObject jsonObject = jObj.getAsJsonObject();
				if (!StringUtils.isEmpty(jsonObject.get("external_references"))
						&& !StringUtils.isEmpty(jsonObject.get("name"))
						&& !StringUtils.isEmpty(jsonObject.get("kill_chain_phases"))
						&& !StringUtils.isEmpty(jsonObject.get("x_mitre_platforms"))) {

					List<String> platFormList = new ArrayList<>();
					JsonArray platforms = (JsonArray) jsonObject.get("x_mitre_platforms");
					for (JsonElement ele : platforms) {
						platFormList.add(ele.getAsString());
					}

					if (platFormList.contains("Linux")) { // 리눅스의 경우만

						MitreAttackVO vo = new MitreAttackVO();
						vo.setName(jsonObject.get("name").getAsString());
						vo.setDescription(jsonObject.get("description").getAsString());

						JsonArray extRefer = (JsonArray) jsonObject.get("external_references");
						List<String> externalIds = new ArrayList<>();
						for (JsonElement ele : extRefer) {
							JsonObject jsonExtRef = (JsonObject) ele;
							if (jsonExtRef.get("external_id") != null) {
								externalIds.add(jsonExtRef.get("external_id").getAsString());
							}
						}
						vo.setExternalIds(externalIds);

						List<String> killChainPhase = new ArrayList<>();
						JsonArray killChain = (JsonArray) jsonObject.get("kill_chain_phases");
						for (JsonElement ele : killChain) {
							JsonObject jsonPhase = (JsonObject) ele;
							killChainPhase.add(jsonPhase.get("phase_name").getAsString());
						}
						vo.setKillChainPhases(killChainPhase);
						vo.setPlatforms(platFormList);

						dao.insertMitreAttackInfo(vo);

					}
				}
			}

		} catch (JsonIOException e) {
			e.printStackTrace();
		} catch (JsonSyntaxException e) {
			e.printStackTrace();
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		}

	}

	public Document selectMitreAttackIdsByKillChainPhases(String isSubT) {

		Document resultDoc = new Document();
		List<String> killChainList = new ArrayList<>();
		List<Object> killChainValueList = new ArrayList<>();
		
		for (KillChainPhases phases : KillChainPhases.values()) {
			List<Document> killCPList = dao.getMitreInfoByKillChainPhase(phases.getName(), isSubT);
			if(killCPList.size()>0) {
				killChainList.add(phases.getName());
				killChainValueList.add(killCPList);
			}
		}
		
		resultDoc.put("version", "ATT&CK v8.0, v.8.1");
		resultDoc.put("spec_version", "2.0");
		resultDoc.put("kill_chain_phases", killChainList);
		resultDoc.put("attack_matrix", killChainValueList);

		return resultDoc;

	}
	
	public Document selectMitreAuditCondition(MitreAuditConditionVO vo){
		return dao.selectMitreAuditCondition(vo);
	}
	
	public List<Document> selectMitreAuditList(MitreAuditVO vo){
		
		List<Document> resultDocList = new ArrayList<>();
		
		//선택한 사용자 감사로그의 T값 초기화
		List<Document> mitreUserAuditList = dao.selectUserAuditLogList(vo);
		System.out.println("selected user audit log count : "+mitreUserAuditList.size());
		//사용자 audit 로그 중복 T값 제거
		List<String> userAuditTList = new ArrayList<String>();
		for(Document doc : mitreUserAuditList) {
			Document bodyDoc = new Document(); //reason : changed audit log format 
			bodyDoc = (Document) doc.get("body");
			userAuditTList.add(bodyDoc.getString("key"));
		}
		List<String> userAuditOnlyTList = userAuditTList.stream().distinct().collect(Collectors.toList());
		
		//해커그룹 별 일치율 계산
		List<Document> attackGroupMatchingList = new ArrayList<Document>();
		//공격 그룹 목록 조회
		List<Document> attackGroupList = dao.selectAttackGroupList(); 
		for(Document attackGroup:attackGroupList) {
			Document attGTValue = dao.selectTValueByGroupName(attackGroup.getString("_id"));
			
			//공격 그룹이 사용한 T값 목록
			List<String> attackGroupTList = (List<String>) attGTValue.get("external_ids");

			//일치 검사
			int matchCnt = 0;
			for(String auditLogT: userAuditOnlyTList) {
				if(attackGroupTList.contains(auditLogT))
					matchCnt++;
			}
			
			if(matchCnt != 0 ) {
				int groupTCnt = attackGroupTList.size();
				double matching = (double)matchCnt/(double)groupTCnt*100.0;
				attGTValue.put("user_external_ids", userAuditOnlyTList);
				attGTValue.put("match_count", matchCnt);
				attGTValue.put("group_t_count", groupTCnt);
				attGTValue.put("matching_value", matching);
				attGTValue.put("matching_rate", Math.round(matching)+"%");
				attackGroupMatchingList.add(attGTValue);
			}
		}
		
		//공격 그룹 별 일치율 오름 차순
		sortAttackGroupMatchList(attackGroupMatchingList);
		
		resultDocList.add(new Document("attack_group_matching", attackGroupMatchingList));
		
		//att&ck matrix T, user audit log T 비교
		List<Document> userAuditMatchList = new ArrayList<Document>();
		//Linux Platfoms에서 사용하는 T 목록 조회
		List<String> mitreAttackMatirxTList = dao.selectMitreAttackMatrixTList();
		for(String matrixT: mitreAttackMatirxTList) {
				
				int tCnt = 0;
				Document doc = new Document();
				List<Object> auditLogObjIdList = new ArrayList<Object>();
				for(Document auditLogDoc : mitreUserAuditList) {
					Document bodyDoc = new Document(); //reason : changed audit log format 
					bodyDoc = (Document) auditLogDoc.get("body");
					if(matrixT.equals(bodyDoc.get("key"))) {
						//추후 상세 분석 기능 요구 시 사용
						auditLogObjIdList.add(auditLogDoc.get("_id").toString()); 
						tCnt++;
					}
				}
				
				if(tCnt == 0)
					continue;
				
				doc.put("external_ids", matrixT);
				doc.put("count", tCnt);
				doc.put("_ids", auditLogObjIdList);
				userAuditMatchList.add(doc);
		}
		
		resultDocList.add(new Document("user_audit_match_t", userAuditMatchList));
		
		return resultDocList;
	}

	//일치율에 따른 sorting
	private void sortAttackGroupMatchList(List<Document> attackGroupMatchingList) {
		Collections.sort(attackGroupMatchingList, new Comparator<Document>() {
			@Override
			public int compare(Document o1, Document o2) {
				  if (o1.getDouble("matching_value") < o2.getDouble("matching_value") ) {
	                    return 1;
	                } else if (o1.getDouble("matching_value")> o2.getDouble("matching_value")) {
	                    return -1;
	                }
	                return 0;
			}

		});
	}
	
	public Document getKillChainPhaseByT(String t) {
		
		Document result = dao.getKillChainPhaseByT(t);
		if(result != null) {
			result.remove("_id");
			result.remove("name");
			result.remove("description");
			result.remove("external_ids");
			result.remove("platforms");
		}
		
		return result;
	}
	

}



