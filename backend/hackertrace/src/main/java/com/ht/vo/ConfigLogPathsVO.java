package com.ht.vo;

import javax.validation.constraints.Pattern;

import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ConfigLogPathsVO {
	
	@ApiModelProperty(value="호스트 아이피", example = "210.114.19.179")
	private String hostIp; 
	
	@Pattern(regexp ="^[0-9][0-9][0-9][0-9]\\-[0-9][0-9]\\-[0-9][0-9]$",
			   message = "시작 일자가 올바른 형식이 아닙니다.")
	@ApiModelProperty(value="검색 시작일", example = "2020-01-01")
	private String startDate;
	
	@Pattern(regexp ="^[0-9][0-9][0-9][0-9]\\-[0-9][0-9]\\-[0-9][0-9]$",
			   message = "끝 일자가 올바른 형식이 아닙니다.")
	@ApiModelProperty(value="검색 마지막일", example = "2021-01-13")
	private String endDate;

}
