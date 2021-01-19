package com.smt.vo;

import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ConfigOriginVO {
	
	@ApiModelProperty(value="호스트 IP", example = "127.0.0.1")
	private String hostIp; 
	
	@ApiModelProperty(value="UID", example = "0")
	private String uid;
	
	@ApiModelProperty(value="형상파일 경로", example = "/etc")
	private String filePath;
	
	@ApiModelProperty(value="형상 관리 파일명", example = "crontab")
	private String fileName;
	
	@ApiModelProperty(value="로그 파일 Object 아이디", example = "5ffeaaa38a35c62284cd8587")
	private String logObjId;
	
}
