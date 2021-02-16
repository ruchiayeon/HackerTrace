package com.ht.vo;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HostsVO {
	
	@ApiModelProperty(value="호스트 이름", example = "관리 호스트")
	private String hostName;
		
	@NotNull
	@Pattern(regexp = "^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$",
			message = "올바른 IP 형식이 아닙니다.")
	@ApiModelProperty(value="호스트 아이피", example = "127.0.0.1")
	private String hostIp;
	
	@ApiModelProperty(value="관리자 아이디", example = "admin")
	private String adminUserId;
	
	@ApiModelProperty(value="활성화 여부", example = "T")
	private String isEnable;
	
}
