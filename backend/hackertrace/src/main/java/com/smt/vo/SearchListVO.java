package com.smt.vo;

import javax.validation.constraints.Pattern;

import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SearchListVO extends PagingVO{
	
	@Pattern(regexp ="^[0-9][0-9][0-9][0-9]\\-[0-9][0-9]\\-[0-9][0-9]$")
	@ApiModelProperty(example = "2020-01-01")
	private String startDate;
	
	@Pattern(regexp ="^[0-9][0-9][0-9][0-9]\\-[0-9][0-9]\\-[0-9][0-9]$")
	@ApiModelProperty(example = "2021-01-13")
	private String endDate;
	
	@ApiModelProperty(example = "type")
	private String searchType;
	
	@ApiModelProperty(example = "SYSCALL")
	private String searchWord;
	
}
