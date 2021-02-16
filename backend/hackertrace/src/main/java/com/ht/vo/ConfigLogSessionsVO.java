package com.ht.vo;

import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ConfigLogSessionsVO {
	
	@ApiModelProperty(value="호스트 아이피", example = "127.0.0.1")
	private String hostIp; 
	
	@ApiModelProperty(value="UID", example = "0")
	private String uid;
	
	@ApiModelProperty(value="형상 관리 파일 생성 시간", example = "2021-01-13 01:00:01")
	private String fileCreateDate; //파일 생성 시간
	
	@ApiModelProperty(value="이전 기간(월단위)",example = "1")
	private String term; 
	
}
