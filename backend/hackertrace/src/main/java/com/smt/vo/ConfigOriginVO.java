package com.smt.vo;

import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ConfigOriginVO {
	
	@ApiModelProperty(example = "127.0.0.1")
	private String hostIp; 
	
	@ApiModelProperty(example = "0")
	private Integer uid;
	
	@ApiModelProperty(example = "/etc")
	private String filePath;
	
	@ApiModelProperty(example = "crontab")
	private String fileName;
	
	@ApiModelProperty(example = "5ffeaaa38a35c62284cd8587")
	private String logObjId;
	
}
