package com.smt.service;

import java.util.ArrayList;
import java.util.List;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smt.dao.DashboardDAO;
import com.smt.dao.MitreAttackDAO;
import com.smt.util.KillChainPhases;

@Service
public class DashboardService {
	
	@Autowired
	DashboardDAO dao;
	
	@Autowired
	MitreAttackDAO mitAttackDao;
	
	public List<Object> countMitreAttackByAuditLog(String hostIp){
		List<Object> countResult = new ArrayList<Object>();
		
		List<Integer> todayList = new ArrayList<Integer>();
		List<Integer> weekList = new ArrayList<Integer>();
		List<Integer> monthList = new ArrayList<Integer>();
		for (KillChainPhases phases : KillChainPhases.values()) {
			
			List<Document> killCPList = mitAttackDao.getMitreInfoByKillChainPhase(phases.getName(), "T");
			List<String> killChainTList = new ArrayList<>();
			if(killCPList.size()>0) {
				
				for(Document doc : killCPList) {
					List<String> externalIdsList = (List<String>) doc.get("external_ids");
					killChainTList.add(externalIdsList.get(0));
				}
				
				todayList.add(dao.countAuditLogByAttakPhases(hostIp, killChainTList, "today"));
				weekList.add(dao.countAuditLogByAttakPhases(hostIp, killChainTList, "week"));
				monthList.add(dao.countAuditLogByAttakPhases(hostIp, killChainTList, "month"));
			}
			
		}
		
		countResult.add(todayList);
		countResult.add(weekList);
		countResult.add(monthList);
		return countResult;
	}
	
	

}
