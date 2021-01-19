package com.smt.vo;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiModelProperty;
import io.swagger.annotations.ApiParam;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class AuditLogListVO extends SearchListVO {

	@NotNull
	@Pattern(
			regexp = "^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$",
			message = "올바른 IP형식이 아닙니다.")
	@ApiModelProperty(value="호스트 아이피", example = "127.0.0.1")
	private String hostIp;
	
	@ApiModelProperty(value="공격 단계", example = "initial-access")
	private String phases;

}
