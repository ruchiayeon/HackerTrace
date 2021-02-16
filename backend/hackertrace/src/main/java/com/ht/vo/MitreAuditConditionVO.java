package com.ht.vo;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MitreAuditConditionVO {

	@ApiModelProperty(value="검색 조건 시작일", example = "2021-01-23")
	@Pattern(regexp ="^[0-9][0-9][0-9][0-9]\\-[0-9][0-9]\\-[0-9][0-9]$",
	message="시작 일자 형식이 올바르지 않습니다.")
	private String startDate;
	
	@ApiModelProperty(value="검색 조건 끝일", example = "2021-01-25")
	@Pattern(regexp ="^[0-9][0-9][0-9][0-9]\\-[0-9][0-9]\\-[0-9][0-9]$",
	message="끝 일자 형식이 올바르지 않습니다.")
	private String endDate;
	
	@NotNull
	@Pattern(regexp = "^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$",
			message = "올바른 IP 형식이 아닙니다.")
	@ApiModelProperty(value="호스트 아이피", example = "210.114.19.179")
	private String hostIp;
	
}
