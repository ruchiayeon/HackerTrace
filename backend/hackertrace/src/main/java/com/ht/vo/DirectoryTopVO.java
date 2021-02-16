package com.ht.vo;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class DirectoryTopVO {
	
	@NotNull
	@Pattern(
			regexp = "^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$",
			message = "올바른 IP형식이 아닙니다.")
	@ApiModelProperty(value="호스트 아이피", example = "127.0.0.1")
	private String hostIp;
	
	String topDirectory;
	

}
