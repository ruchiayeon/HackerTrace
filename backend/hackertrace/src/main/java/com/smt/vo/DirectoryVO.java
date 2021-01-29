package com.smt.vo;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DirectoryVO {
	
	private String hostIp;
	
	private String filePath;
	
	private String updateTime;
	
	private List<String> fileNames;

}
