package com.smt.service;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.util.ArrayList;
import java.util.List;

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
import com.smt.vo.MitreAttackVO;

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
			int index = 0 ;
			
			for (JsonElement jObj : objArray) {
				
				JsonObject jsonObject = jObj.getAsJsonObject();
				if( !StringUtils.isEmpty(jsonObject.get("external_references"))
				&&	!StringUtils.isEmpty(jsonObject.get("name"))
				&&	!StringUtils.isEmpty(jsonObject.get("kill_chain_phases"))
       			&&	!StringUtils.isEmpty(jsonObject.get("x_mitre_platforms"))
					) {
					
					List<String> platFormList = new ArrayList<>();
					JsonArray platforms = (JsonArray) jsonObject.get("x_mitre_platforms");
					for(JsonElement ele:platforms) {
						platFormList.add(ele.getAsString());
					}
					
					if(platFormList.contains("Linux")) { //리눅스의 경우에 만
					
						MitreAttackVO vo = new MitreAttackVO();
						vo.setName(jsonObject.get("name").getAsString());
						vo.setDescription(jsonObject.get("description").getAsString());
						
						JsonArray extRefer = (JsonArray) jsonObject.get("external_references");
						List<String> externalIds = new ArrayList<>();
						for(JsonElement ele:extRefer) {
							JsonObject jsonExtRef = (JsonObject) ele;
							if(jsonExtRef.get("external_id") != null) {
								externalIds.add(jsonExtRef.get("external_id").getAsString());
							}
						}
						vo.setExternalIds(externalIds);
						
						List<String> killChainPhase = new ArrayList<>();
						JsonArray killChain = (JsonArray) jsonObject.get("kill_chain_phases");
						for(JsonElement ele:killChain) {
							JsonObject jsonPhase = (JsonObject) ele;
							killChainPhase.add(jsonPhase.get("phase_name").getAsString());
						}
						vo.setKillChainPhases(killChainPhase);
						vo.setPlatforms(platFormList);
						
						dao.insertMitreAttackInfo(vo);
						index++;
						
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
}
