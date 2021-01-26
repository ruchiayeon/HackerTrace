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
	
	public Document countMitreAttackByAuditLog(String hostIp){
		Document countResult = new Document();
		try {
		
		if(dao.existAuditLogByHostIp(hostIp)) {
		
			for (KillChainPhases phases : KillChainPhases.values()) {
				
				List<Document> killCPList = mitAttackDao.getMitreInfoByKillChainPhase(phases.getName(), "T");
				List<String> killChainTList = new ArrayList<>();
				if(killCPList.size()>0) {
					
					for(Document doc : killCPList) {
						List<String> externalIdsList = (List<String>) doc.get("external_ids");
						killChainTList.add(externalIdsList.get(0));
					}
					
					countResult.put(phases.getName().trim(), dao.countAuditLogByAttakPhases(hostIp, killChainTList, "today"));
				}
				
			}
			
		}else {
			for (KillChainPhases phases : KillChainPhases.values()) {
				List<Document> killCPList = mitAttackDao.getMitreInfoByKillChainPhase(phases.getName(), "T");
				if(killCPList.size()>0) {
					countResult.put(phases.getName().trim(), "0");
				}
			}
			
		}
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return countResult;
	}
	
	public List<Document> getMitreAttackCountInfo(String hostIp) {
		List<Document> docList = new ArrayList<>();
		
		Document todayCounts =new Document(); 
		Document weekCounts = new Document();
		Document monthCounts = new Document();
		
		todayCounts = dao.getStatsMitreCountInfo(hostIp, "mitre", "today");
		todayCounts.put("term", "TODAY");
		
		weekCounts = dao.getStatsMitreCountInfo(hostIp, "mitre", "week");
		weekCounts.put("term", "WEEK");
		
		monthCounts = dao.getStatsMitreCountInfo(hostIp, "mitre", "month");
		monthCounts.put("term", "MONTH");
		
		docList.add(todayCounts==null?new Document():todayCounts);
		docList.add(weekCounts==null? new Document():weekCounts);
		docList.add(monthCounts==null? new Document():monthCounts);
		
		return docList;
		
	}
	
	public Document getConfigModifyCountWeek(String hostIp) throws Exception {
		return dao.getConfigModifyCountWeek(hostIp, "config");
	}
	
	

}
