package com.smt.vo;

import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ConfigLogVO {
	
	@ApiModelProperty(value="호스트 아이피", example = "127.0.0.1")
	private String hostIp; 
	
	@ApiModelProperty(value="형상 관리 파일명", example = "crontab")
	private String fileName;
	
	@ApiModelProperty(value="형상 관리 파일 경로", example = "/etc")
	private String filePath;
	
	@ApiModelProperty(value="형상 관리 파일 내용", example = "* * * * File ./abc.sh ")
	private String contents;
	
	@ApiModelProperty(value="UID", example = "0")
	private String uid;
	
	@ApiModelProperty(value="형상 관리 파일 생성 시간", example = "2021-01-13 01:00:01 ")
	private String fileCreateDate; //파일 생성 시간
	
	
}
