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
import com.smt.vo.MitreAuditConditionSesVO;
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
	
//	public Document selectMitreAuditCondition(MitreAuditConditionVO vo){
//		return dao.selectMitreAuditCondition(vo);
//	}
	
	public Document selectMitreAuditConditionUid(MitreAuditConditionVO vo){
		return dao.selectMitreAuditConditionUid(vo);
	}
	
	public Document selectMitreAuditConditionSes(MitreAuditConditionSesVO vo){
		return dao.selectMitreAuditConditionSes(vo);
	}
	
	public List<Document> selectMitreAuditList(MitreAuditVO vo){
		
		List<Document> resultDocList = new ArrayList<>();
		
		//선택한 사용자 감사로그의 T값 초기화
		List<Document> mitreUserAuditAllList = new ArrayList<Document>();
		mitreUserAuditAllList = dao.selectUserAuditLogList(vo);
		
		//사용자 중복 T 값 제거
		List<String> mitreUserAuditOnlyTList = new ArrayList<String>();
		for(Document doc : mitreUserAuditAllList) {
			mitreUserAuditOnlyTList.add(doc.getString("body_key").replaceAll("\\\"", ""));
		}
		mitreUserAuditOnlyTList = mitreUserAuditOnlyTList.stream().distinct().collect(Collectors.toList());
		
		//해커그룹 별 일치율 계산
		List<Document> attackGroupMatchingList = getMitreUserAuditMatching(mitreUserAuditOnlyTList);
		resultDocList.add(new Document("attack_group_matching", attackGroupMatchingList));
		
		//TODO : 추후 상세 분석 기능 요구 시 사용 활용
		//audit 로그 일치 ID 목록
		List<Document> userAuditLogMatchObjIdList = getUserAuditLogMatchObjId(mitreUserAuditAllList);
		resultDocList.add(new Document("user_audit_match_t", userAuditLogMatchObjIdList));
		
		return resultDocList;
	}
	
	private List<Document> getMitreUserAuditMatching(List<String> mitreUserAuditOnlyTList) {
		
		List<Document> attackGroupMatchingList = new ArrayList<Document>();
		
		//공격 그룹 목록 조회
		List<Document> attackGroupAllList = dao.selectAttackGroupList(); 
		for(Document attackGroup:attackGroupAllList) {
			Document attackGroupDoc = dao.selectTValueByGroupName(attackGroup.getString("_id"));
			
			//공격 그룹이 사용한 T값 목록
			List<String> attackGroupTList = (List<String>) attackGroupDoc.get("attack_group_external_ids");
			
			//일치 검사
			int matchCnt = 0;
			for(String auditLogT: mitreUserAuditOnlyTList) {
				if(attackGroupTList.contains(auditLogT))
					matchCnt++;
			}
			
			if(matchCnt != 0 ) {
				int groupTCnt = attackGroupTList.size();
				double matching = (double)matchCnt/(double)groupTCnt*100.0;
				attackGroupDoc.put("user_external_ids", mitreUserAuditOnlyTList);
				attackGroupDoc.put("match_count", matchCnt);
				attackGroupDoc.put("group_t_count", groupTCnt);
				attackGroupDoc.put("matching_value", matching);
				attackGroupDoc.put("matching_rate", Math.round(matching)+"%");
				attackGroupMatchingList.add(attackGroupDoc);
			}
		}
		
		//공격 그룹 별 일치율 오름 차순
		sortAttackGroupMatchList(attackGroupMatchingList);
		return attackGroupMatchingList;
	}

	private List<Document> getUserAuditLogMatchObjId(List<Document> mitreUserAuditAllList) {
		//att&ck matrix T, user audit log T 비교
		List<Document> userAuditLogMatchObjIdList = new ArrayList<Document>();
		//Linux Platfoms에서 사용하는 T 목록 조회
		List<String> mitreAttackMatirxTList = dao.selectMitreAttackMatrixTList();
		for(String matrixT: mitreAttackMatirxTList) {
				
				List<Object> auditLogObjIdList = new ArrayList<Object>();
				for(Document userAuditLog : mitreUserAuditAllList) {
					if(matrixT.equals(userAuditLog.getString("body_key").replaceAll("\\\"", ""))) 
						auditLogObjIdList.add(userAuditLog.get("_id").toString()); 
				}
				
				if(auditLogObjIdList.size() > 0) {
					Document doc = new Document();
					doc.put("external_ids", matrixT);
					doc.put("_ids", auditLogObjIdList);
					userAuditLogMatchObjIdList.add(doc);
				}
		}
		return userAuditLogMatchObjIdList;
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



