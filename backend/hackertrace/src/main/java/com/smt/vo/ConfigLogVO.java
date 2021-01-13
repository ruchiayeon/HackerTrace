package com.smt.vo;

import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ConfigLogVO {
	
	@ApiModelProperty(example = "127.0.0.1")
	private String hostIp; 
	
	@ApiModelProperty(example = "crontab")
	private String fileName;
	
	@ApiModelProperty(example = "/etc")
	private String filePath;
	
	@ApiModelProperty(example = "* * * * File ./abc.sh ")
	private String contents;
	
	@ApiModelProperty(example = "0")
	private Integer uid;
	
	@ApiModelProperty(example = "2021-01-13 01:00:01 ")
	private String fileCreateDate; //파일 생성 시간
	
	
}
