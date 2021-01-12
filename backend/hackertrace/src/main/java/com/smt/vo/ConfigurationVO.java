package com.smt.vo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ConfigurationVO {
	
	private String fileName;
	private String filePath; 
	private String contents; 
	private String writer; 
	private String fileCreateDate; //파일 생성 시간
	private String createDate;//DB저장 시간
	
}
