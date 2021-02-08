package com.smt.service;

import java.io.File;
import java.io.FileNotFoundException;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.smt.dao.AuditLogDAO;
import com.smt.util.DateUtil;
import com.smt.util.TimeUtils;
import com.smt.vo.AuditLogListVO;
import com.smt.vo.AuditLogVO;

@Service
public class AuditLogService {

	@Autowired
	AuditLogDAO dao;
	
	public List<Document> getAuditLogList(AuditLogListVO vo){
		List<Document> list = new ArrayList<Document>();
		for(Document doc : dao.getAuditLogList(vo)) {
			Document dataDoc = new Document();
			String eventTime = (String)doc.get("body_event_time");
			String[] splitEventTime = eventTime.split("\\+");
			
			String bodyKey = (String)doc.get("body_key");
			String bodyExe = (String)doc.get("body_exe");
			String bodyComm = (String)doc.get("body_comm");
			
			dataDoc.put("body_event_time",splitEventTime[0].trim());
			dataDoc.put("body_success", (String)doc.get("body_success"));
			dataDoc.put("body_key", bodyKey.replaceAll("\\\"", ""));
			dataDoc.put("header_message:type", (String)doc.get("header_message:type"));
			dataDoc.put("body_ses", (String)doc.get("body_ses"));
			dataDoc.put("body_uid", (String)doc.get("body_uid"));
			dataDoc.put("body_exe", bodyExe.replaceAll("\\\"", ""));
			dataDoc.put("body_comm", bodyComm.replaceAll("\\\"", ""));
			dataDoc.put("body_syscall", (String)doc.get("body_syscall"));
			
			
			list.add(dataDoc);
		}
		return list;
	}
	
	public void insertAuditLogByLogFile(String filePath) {

		File auditLogFile = new File(filePath);
		Scanner fileLine;
		try {
			fileLine = new Scanner(auditLogFile);
			dao.dropAuditLogCollection();
			
			int index = 0;
			while (fileLine.hasNextLine()) {
				
				AuditLogVO aLVO = new AuditLogVO();
				String line = fileLine.nextLine();
				String[] splitLine = line.split(" ");

				index++;
				
				List<String> arguments = new ArrayList<String>(); //arguments
				for (String field : splitLine) {
					String[] keyValSplit = field.split("\\=");
					readLineFieldMapping(aLVO, arguments, keyValSplit);
				}
				
				aLVO.setHostIp("127.0.0.1");
				dao.insertAuditLog(aLVO);
				
				if(index == 4000)
					break;

			}
		} catch (Exception e) {
			e.printStackTrace();
		}

	}
	
	public void insertAuditLogByReqLog(String line) {
		
		try {
			
			String[] splitLine = line.split(" ");
			
			AuditLogVO aLVO = new AuditLogVO();
			List<String> arguments = new ArrayList<String>(); //arguments
			
			for (String field : splitLine) {
				
				String[] keyValSplit = field.split("\\=");
				readLineFieldMapping(aLVO, arguments, keyValSplit);
				
				if(keyValSplit[0].equals("node")) {
					aLVO.setHostIp(keyValSplit[1]);
				}
			}
			
			dao.insertAuditLog(aLVO);
		
		} catch (Exception e) {
			e.printStackTrace();
		}
		
	}

	private void readLineFieldMapping(AuditLogVO aLVO, List<String> arguments, String[] keyValSplit) {
		
		if (keyValSplit[0].equals("type")) {
			
			aLVO.setType(keyValSplit[1]);
			
		} else if (keyValSplit[0].equals("msg")) {
			
			aLVO.setMsg(keyValSplit[1]);
			aLVO.setTime(TimeUtils.getAuditMsgToDate(keyValSplit[1]));
			
		} else if (keyValSplit[0].equals("proctitle")) {
			
			aLVO.setProctitle(keyValSplit[1]);
			
		} else if (keyValSplit[0].equals("arch")) {
			
			aLVO.setArch(keyValSplit[1]);
			
		} else if (keyValSplit[0].equals("syscall")) {
			
			aLVO.setSyscall(keyValSplit[1]);
			
		} else if (keyValSplit[0].equals("item")) {
			
			aLVO.setItems(keyValSplit[1]);
			
		} else if (keyValSplit[0].equals("name")) {
			
			aLVO.setName(keyValSplit[1].replaceAll("\\\"", ""));
			
		} else if (keyValSplit[0].equals("key")) {
			
			aLVO.setKey(keyValSplit[1].replaceAll("\\\"", ""));
			
		} else if(keyValSplit[0].equals("uid")) {
			
			aLVO.setUid(keyValSplit[1]);
			
		} else if(keyValSplit[0].equals("ses")) {
			
			aLVO.setSes(keyValSplit[1]);
			
		} 
		
		for(int i = 0 ; i<80; i++) {
			String keyName = "a"+i;
			
			if(keyValSplit[0].equals(keyName)) {
				arguments.add(keyValSplit[1]);
			}
		}
		
		if(arguments.size()>0)
			aLVO.setArguments(arguments);
		
	}
}
