package com.smt.vo;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HostsVO {
	
	@ApiModelProperty(example = "관리 호스트")
	private String hostName;
		
	@NotNull
	@Pattern(regexp = "^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$")
	@ApiModelProperty(example = "127.0.0.1")
	private String hostIp;
	
	@ApiModelProperty(example = "admin")
	private String adminUserId;
	
	@ApiModelProperty(example = "T")
	private String isEnable;
	
}
