package com.ht.vo;

import javax.validation.constraints.Pattern;

import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MitreAuditVO  {
	
	@ApiModelProperty(value="검색 조건 시작일", example = "2020-01-06")
	@Pattern(regexp ="^[0-9][0-9][0-9][0-9]\\-[0-9][0-9]\\-[0-9][0-9]$",
				message="시작 일자 형식이 올바르지 않습니다.")
	private String startDate;
	
	@ApiModelProperty(value="검색 조건 끝일", example = "2021-01-06")
	@Pattern(regexp ="^[0-9][0-9][0-9][0-9]\\-[0-9][0-9]\\-[0-9][0-9]$", 
				message="끝 일자 혁시이 올바르지 않습니다.")
	private String endDate;
	
	@ApiModelProperty(value="호스트 아이피", example = "127.0.0.1")
	@Pattern(regexp = "^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$",
				message="올바르지 않은 IP 형식입니다.")
	private String hostIp;
	
	@ApiModelProperty(value="UID", example = "0")
	private String uid;
	
	@ApiModelProperty(value="세션아이디", example = "2")
	private String ses;

}
