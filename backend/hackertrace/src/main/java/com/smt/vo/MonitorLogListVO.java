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
public class MonitorLogListVO extends PagingVO {
	
	@Pattern(regexp ="^[0-9][0-9][0-9][0-9]\\-[0-9][0-9]\\-[0-9][0-9]$",
			   message = "시작 일자가 올바른 형식이 아닙니다.")
	@ApiModelProperty(value="검색 시작일", example = "2020-01-01")
	private String startDate;
	
	@Pattern(regexp ="^[0-9][0-9][0-9][0-9]\\-[0-9][0-9]\\-[0-9][0-9]$",
			   message = "끝 일자가 올바른 형식이 아닙니다.")
	@ApiModelProperty(value="검색 마지막일", example = "2021-02-04")
	private String endDate;

	@NotNull
	@Pattern(
			regexp = "^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$",
			message = "올바른 IP형식이 아닙니다.")
	@ApiModelProperty(value="호스트 아이피", example = "210.114.19.179")
	private String hostIp;
	
	@NotNull
	@ApiModelProperty(value="조회 필드 종류(ex.CPU, Process, Memory, Storage, Network)", example = "CPU")
	private String useFieldType;

}
