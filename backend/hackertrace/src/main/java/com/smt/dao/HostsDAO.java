package com.smt.dao;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Repository;

@Repository
public class HostsDAO {

	
	@Autowired
	private Environment env;


	public List<Map<String,String>> getAllSavedHostsList() throws UnsupportedEncodingException {
		List<Map<String,String>> result = new ArrayList<>();
		
		String[] getAllHostsIps = env.getProperty("ht.hosts").split(",");
		String[] getAllHostsNames = env.getProperty("ht.hosts.name").split(",");
		for(int i=0; i< getAllHostsIps.length; i++) {
			Map<String,String> map = new HashMap<>();
			String hostIp = new String(getAllHostsIps[i].trim().getBytes("ISO-8859-1"), "utf-8");
			String hostName = new String(getAllHostsNames[i].trim().getBytes("ISO-8859-1"), "utf-8");
			map.put("hostIp", hostIp);
			map.put("hostName", hostName);
			result.add(map);
		}
		
		return result;
	}
	
	public List<Document> getHostsListByUserId(String userId) {
		List<Document> result = new ArrayList<>();
		try {
		String[] getHostIps = env.getProperty("ht."+userId+".host").split(",");
		String[] getHostsNames = env.getProperty("ht."+userId+".name").split(",");
			
		for(int i=0; i< getHostIps.length; i++) {
			Document doc = new Document();
			String hostIp = new String(getHostIps[i].trim().getBytes("ISO-8859-1"), "utf-8");
			String hostName = new String(getHostsNames[i].trim().getBytes("ISO-8859-1"), "utf-8");
			
			doc.put("hostIp", hostIp);
			doc.put("hostName", hostName);
			result.add(doc);
		}
		}catch(Exception e) {
			
		}
		
		return result;
	}
	

}
