package com.smt.vo;

import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ConfigLogContentsVO {
	
	@ApiModelProperty(value="원본(로그) 파일 Object 아이디", example = "5ffeaaa38a35c62284cd8587")
	private String orgObjId;
	
	@ApiModelProperty(value="로그 파일 Object 아이디", example = "5ffeaaa38a35c62284cd8587")
	private String logObjId;
	
}
