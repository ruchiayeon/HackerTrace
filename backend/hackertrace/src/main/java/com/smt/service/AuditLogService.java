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
import com.smt.util.TimeUtils;
import com.smt.vo.AuditLogListVO;
import com.smt.vo.AuditLogVO;

@Service
public class AuditLogService {

	@Autowired
	AuditLogDAO dao;
	
	public void insertAuditLogByLogFile(String filePath) {

		File auditLogFile = new File(filePath);
		Scanner fileLine;
		try {
			fileLine = new Scanner(auditLogFile);
			dao.dropAuditLogColleciton();
			
			int index = 0;
			while (fileLine.hasNextLine()) {
				
				AuditLogVO aLVO = new AuditLogVO();
				String line = fileLine.nextLine();
				String[] splitLine = line.split(" ");

				index++;
				
				List<String> arguments = new ArrayList<String>(); //arguments
				for (String field : splitLine) {
					
					String[] keyValSplit = field.split("\\=");
					
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
						
						aLVO.setSyscall(Integer.valueOf(keyValSplit[1]));
						
					} else if (keyValSplit[0].equals("item")) {
						
						aLVO.setItems(Integer.valueOf(keyValSplit[1]));
						
					} else if (keyValSplit[0].equals("name")) {
						
						aLVO.setName(keyValSplit[1].replaceAll("\\\"", ""));
						
					} else if (keyValSplit[0].equals("key")) {
						
						aLVO.setKey(keyValSplit[1].replaceAll("\\\"", ""));
						
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
				
				dao.insertAuditLog(aLVO);
				
				if(index == 1000)
					break;

			}
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		}

	}
	
	public List<Document> getAuditLogList(AuditLogListVO param){
		List<Document> result = new ArrayList<>();
		for(Document doc : dao.getAuditLogList(param)) {
			doc.remove("_id");
			doc.remove("_class");
			result.add(doc);
		}
		return result;
	}
}
