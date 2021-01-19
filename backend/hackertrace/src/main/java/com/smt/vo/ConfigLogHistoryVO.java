package com.smt.vo;

import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ConfigLogHistoryVO {
	
	@ApiModelProperty(value="호스트 아이피", example = "127.0.0.1")
	private String hostIp; 
	
	@ApiModelProperty(value="형상관리 파일명", example = "crontab")
	private String fileName;
	
	@ApiModelProperty(value="UID", example = "0")
	private String uid;
	
	@ApiModelProperty(value="세션아이디", example = "0")
	private String ses; 
	
	@ApiModelProperty(value="파일 생성 시간", example = "2021-01-13 01:00:01")
	private String fileCreateDate;
	
	@ApiModelProperty(value="이전 로그 검색 기간", example = "1")
	private String term; 
	
	@ApiModelProperty(value="파일 명 언급 여부", example = "T")
	private String isAll; 
	
}
