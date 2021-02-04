package com.smt.service;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.bson.Document;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import com.smt.dao.ConfigLogDAO;
import com.smt.util.DateUtil;
import com.smt.util.FileUtil;
import com.smt.vo.ConfigContentsVO;
import com.smt.vo.ConfigLogContentsVO;
import com.smt.vo.ConfigLogHistoryVO;
import com.smt.vo.ConfigLogListVO;
import com.smt.vo.ConfigLogMessageVO;
import com.smt.vo.ConfigLogPathsVO;
import com.smt.vo.ConfigLogSesCondVO;
import com.smt.vo.ConfigLogSessionsVO;
import com.smt.vo.ConfigLogVO;
import com.smt.vo.DirectoryTopVO;
import com.smt.vo.DirectoryVO;

@Service
public class ConfigLogService {
	
	@Autowired
	ConfigLogDAO dao;
	
	@Autowired
	private Environment env;
	
	public void dropCofingOriginFile() {
		dao.dropConfigOriginFile();
	}

	public boolean insertConfigOriginFile(ConfigLogVO vo) {
		boolean result = false;
		if(dao.selectConfigOriginFile(vo).size()<1) {
			dao.insertConfigOrginFile(vo);
			result = true;
		}
		return result;
	}
	
	public List<Document> selectConfigFileDirectory(DirectoryTopVO vo){
		
		List<Document> resultDocList = new ArrayList<Document>();
		
		try {
			
			Integer nextPathDepth = vo.getTopDirectory().split("\\/").length;
			
			for(Document doc:dao.selectConfigFileDirectory(vo)) {
				
				Document resultDoc = new Document();
				
				String filePathName = (String) doc.get("filePath");
				String[] docPathSplit = filePathName.split("\\/");
				
				//DB path(/etc/a/b) vs Input path(/etc/a)
				if(docPathSplit.length > nextPathDepth)
					resultDoc.put("name", "/"+docPathSplit[nextPathDepth]);
				
				//중복 Document 검사
				boolean chkDupliName = false;
				for(Document res : resultDocList) {
					
					if(docPathSplit.length > nextPathDepth) {
						
						if(res.get("name").equals("/"+docPathSplit[nextPathDepth]))
							chkDupliName = true;
						
					}
				}
				
				if(!chkDupliName&&!resultDoc.isEmpty())
					resultDocList.add(resultDoc);
				
			}
		
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return resultDocList;
	}
	
	public List<String> getFileNamesByFilePath(DirectoryTopVO vo){
		return dao.getFileNamesByFilePath(vo);
	}
	
	
	public void insertConfigLogFile(String hostIp, ConfigLogMessageVO configLogMsgVO) {
		
		//설정 파일에 콤마(,)구분자가 없을 경우
		try {
			insertConfigLogDataHandle(hostIp, configLogMsgVO);
		}catch(Exception e) {
			e.printStackTrace();
		}
		
	}

	private void insertConfigLogDataHandle(String hostIp, ConfigLogMessageVO configLogMsgVO) throws IOException {

		String filePath = configLogMsgVO.getMessage();
		
		// /호스트아이피/설정 파일 경로/fluentd 로그 파일 경로
		filePath = "/home/manager/HostServer/"+hostIp+filePath;
		//String passwdPath = "/home/manager/HostServer/"+hostIp+"/etc/passwd";
		
		if(FileUtil.existFile(filePath)) {
			System.out.println("success file check :"+filePath);
			Map<String,String> fileInfoMap = FileUtil.getFileInfo(filePath);
			
			ConfigLogVO vo = new ConfigLogVO();
			vo.setHostIp(hostIp);
			vo.setFileCreateDate(fileInfoMap.get("CREATEDATE"));
			vo.setFileName(fileInfoMap.get("FILENAME"));
			vo.setFilePath(fileInfoMap.get("FILEPATH"));
			vo.setOwner(fileInfoMap.get("OWNER"));
			vo.setLogTime(DateUtil.getCurrentMilleTime());
			
			List<String> readFileText = FileUtil.readFileTextList(filePath);
			if(readFileText.size()>0) {
				vo.setContents(readFileText);
			}else {
				vo.setContents(new ArrayList<String>());
			}
			System.out.println("insert  :"+DateUtil.getCurrentMilleTime());
			System.out.println("insert  :"+vo.getFileName());
			dao.insertConfigLogFile(vo);
			
			DirectoryVO dirVO = new DirectoryVO();
			dirVO.setHostIp(hostIp);
			dirVO.setUpdateTime(DateUtil.getCurrentTime());
			dirVO.setFilePath(FileUtil.getOnlyPathByFullPath(filePath));
			
			List<String> fileNames = new ArrayList<String>();
			fileNames.add(vo.getFileName());
			dirVO.setFileNames(fileNames);
			
			List<Document> configDirectoryDocList = dao.selectConfigLogDirectory(dirVO);
			if(configDirectoryDocList.size()<1 ) {
				dao.insertConfigLogDirectory(dirVO);
			}else {
				Document findOneDoc = dao.selectConfigLogDirectory(dirVO).get(0);
				
				List<String> fileNameList = (List<String>) findOneDoc.get("fileNames");
				if(!fileNameList.contains(vo.getFileName()))
					fileNameList.add(vo.getFileName());
				
				findOneDoc.put("fileNames", fileNameList);
				findOneDoc.put("updateTime", DateUtil.getCurrentTime());
				dao.updateConfigLogDirctoryFileNames(dirVO, findOneDoc);	
				
			}
			
		}
		
	}
	


	private String getUidByOwner(String passwdPath, Map<String, String> fileInfoMap) {
		
		String command = "cat " + passwdPath + "|grep " + fileInfoMap.get("OWNER") + ":";

		String passwdResult = "";
		String uid = "";
		
		try {
			Runtime runtime = Runtime.getRuntime();
			
			List<String> cmdList = new ArrayList<String>();
			 
		    cmdList.add("/bin/sh");
		    cmdList.add("-c");
		    cmdList.add(command);
		    System.out.println(command);
		    String[] array = cmdList.toArray(new String[cmdList.size()]);
			Process process = runtime.exec(array);
			InputStream is = process.getInputStream();
			InputStreamReader isr = new InputStreamReader(is);
			BufferedReader br = new BufferedReader(isr);
			String line;
			while ((line = br.readLine()) != null) {
				passwdResult = line;
			}
			System.out.println(passwdResult);
			uid = passwdResult.split(":")[2];
			
		} catch (Exception e) {
			e.printStackTrace();
		}
		return uid;
		
	}
	
	public List<Document> selectConfigLogFileList(ConfigLogListVO vo){
		List<Document> resultList = new ArrayList<Document>();
		for(Document doc : dao.selectConfigLogFileList(vo)) {
			Document fileLogDocument = new Document();
			String remainFilePath = FileUtil.getOnlyPathByRemainFullPath((String)doc.get("filePath"));
			
			fileLogDocument.put("_id", doc.get("_id").toString());
			fileLogDocument.put("hostIp", doc.get("hostIp"));
			fileLogDocument.put("fileName", doc.get("fileName"));
			fileLogDocument.put("filePath", remainFilePath);
			fileLogDocument.put("owner", doc.get("owner"));
			fileLogDocument.put("fileCreateDate", doc.get("fileCreateDate"));
			fileLogDocument.put("logTime", doc.get("logTime"));
			
			resultList.add(fileLogDocument);
		}
		
		return resultList;
	}
	
	public List<Document> selectConfigOriginLogFileContents(ConfigLogContentsVO vo) {
		return dao.selectConfigOriginLogFileContents(vo);
	}
	
	public List<Document> selectConfigContents(ConfigContentsVO vo) {
		return dao.selectConfigContents(vo);
	}
	
	public List<Document> selectBefroDateAuditLogSessionList(ConfigLogSessionsVO vo){
		return dao.selectBefroDateAuditLogSessionList(vo);
	}
	
	public List<String> selectBeforDateAuditLogSes(ConfigLogSesCondVO vo){
		List<String> sesList = new ArrayList<>();
		
		try {
			List<String> headerMsgList = new ArrayList<>();
			//case 1: bodyName equal : path+filename or bobyName equal : fileaname
			for(Document headerMsg : dao.historyConditionBodyName(vo)) {
	//			System.out.println(headerMsg.toJson());
				headerMsgList.add((String)headerMsg.get("_id"));
			}
			
			//case 2: type excve , a0 ~ aN 까지 언급 된 경우
			for(Document headerMsg : dao.historyConditionExecve(vo)) {
				headerMsgList.add((String)headerMsg.getString("header_msg"));
			}
			
			headerMsgList =  headerMsgList.stream().distinct().collect(Collectors.toList());
			
			for(String hMsg : headerMsgList) {
				String ses = dao.getSesList(vo.getHostIp(), hMsg);
				sesList.add(ses);
			}
			
			sesList = sesList.stream().distinct().collect(Collectors.toList());
		}catch(Exception e) {
			e.printStackTrace();
		}
		
		return sesList;
	}
	
	public List<Document> selectBeforDateAuditLogByConfigLog(ConfigLogHistoryVO vo){
		return dao.selectBeforDateAuditLogByConfigLog(vo);
	}
	
	public List<String> selectConfigLogPathList(ConfigLogPathsVO vo ){
		List<Document> docConfigLogList = dao.selectConfigLogPathList(vo);
		List<String> pathList = new ArrayList<String>();
		for(Document doc : docConfigLogList) {
			String fullPath = doc.get("filePath")+"/"+doc.get("fileName");
			pathList.add(FileUtil.getOnlyPathByRemainFullPath(fullPath));
		}
		
		pathList = 	pathList.stream().distinct().collect(Collectors.toList());
		
		return pathList;
	}
	

}
