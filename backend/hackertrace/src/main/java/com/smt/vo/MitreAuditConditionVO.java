package com.smt.vo;

import javax.validation.constraints.Pattern;

import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MitreAuditConditionVO {

	@ApiModelProperty(example = "2020-01-06")
	@Pattern(regexp ="^[0-9][0-9][0-9][0-9]\\-[0-9][0-9]\\-[0-9][0-9]$")
	private String startDate;
	
	@ApiModelProperty(example = "2021-01-06")
	@Pattern(regexp ="^[0-9][0-9][0-9][0-9]\\-[0-9][0-9]\\-[0-9][0-9]$")
	private String endDate;
	
}
