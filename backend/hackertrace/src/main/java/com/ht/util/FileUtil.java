package com.ht.util;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.Charset;
import java.nio.charset.MalformedInputException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.attribute.BasicFileAttributes;
import java.nio.file.attribute.FileTime;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class FileUtil {

	public static boolean existFile(String filePath) {
		return new File(filePath).exists()&& !new File(filePath).isDirectory() ? true : false;
	}

	public static List<String> readFileTextList(String filePath) throws IOException {

		Path path = Paths.get(filePath);
		List<String> list = new ArrayList<String>();

		if (Files.isReadable(path)&&Files.size(path) > 0) {
			
//			try {
//				list = Files.readAllLines(path, StandardCharsets.UTF_8);
//			} catch (IOException e) {
//				e.printStackTrace();
//			}
//			
			List<Charset> charSet = new ArrayList<>();
			charSet.add(StandardCharsets.UTF_8);
			charSet.add(StandardCharsets.ISO_8859_1);
			
            for (Charset charset : charSet) {
                try {
                	list = Files.readAllLines(path, charset);
                    break;
                } catch (MalformedInputException e) {
                    continue;
                }
            }
			
		} else {
			System.out.println("읽기 권한이 없음");
		}
		
		return list;
	}

	public static Map<String, String> getFileInfo(String path) {
		File file = new File(path);
		String formatted = "";
		BasicFileAttributes attrs = null;

		Map<String, String> fileInfoMap = new HashMap<String, String>();
		try {
			attrs = Files.readAttributes(file.toPath(), BasicFileAttributes.class);
			FileTime time = attrs.lastModifiedTime();
			
			String pattern = "yyyy-MM-dd HH:mm:ss";
			SimpleDateFormat simpleDateFormat = new SimpleDateFormat(pattern);
			formatted = simpleDateFormat.format(new Date(time.toMillis()));

			fileInfoMap.put("CREATEDATE", formatted);
			fileInfoMap.put("FILENAME", file.getName());

			Path filePath = Paths.get(path);
			fileInfoMap.put("OWNER", Files.getOwner(filePath).toString());
			fileInfoMap.put("FILEPATH", file.getParent());

		} catch (IOException e) {
			e.printStackTrace();
		}

		return fileInfoMap;
	}
	
	public static String getUidByOwner(String path, String owner) {
		String command = "cat " + path + "|grep " + owner + ":x";

		String passwdResult = "";
		String uid = "";
		System.out.println("command "+command);
		try {
			Runtime runtime = Runtime.getRuntime();
			Process process = runtime.exec(command);
			InputStream is = process.getInputStream();
			InputStreamReader isr = new InputStreamReader(is);
			BufferedReader br = new BufferedReader(isr);
			String line;
			while ((line = br.readLine()) != null) {
				passwdResult = line;
				break;
			}
			System.out.println("shell command result :" + passwdResult);
//			uid = passwdResult.split(":")[2];
			uid = passwdResult;
		} catch (Exception e) {
			e.printStackTrace();
		}

		return uid;
	}
	
	public static String getOnlyPathByFullPath(String msgFilePath) {
		String[] pathNames = msgFilePath.split("\\/");
		String onlyPath = "";
		for(int i=5; i< pathNames.length-1; i++) {
			String path= pathNames[i];
			if(!path.isEmpty())
				onlyPath += "/"+path;
		}
		return onlyPath;
	}
	
	public static String getOnlyPathByRemainFullPath(String msgFilePath) {
		String[] pathNames = msgFilePath.split("\\/");
		String onlyPath = "";
		for(int i=5; i< pathNames.length; i++) {
			String path= pathNames[i];
			if(!path.isEmpty())
				onlyPath += "/"+path;
		}
		return onlyPath;
	}
	public static void main(String[] args) {
		String filePath = "/home/manager/HostServer/210.114.19.179/etc/ji3/ji3_1";
		System.out.println(	getOnlyPathByRemainFullPath(filePath));
	}

}
