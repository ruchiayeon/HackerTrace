package com.ht.vo;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SearchListVO extends PagingVO{
	
	@Pattern(regexp ="^[0-9][0-9][0-9][0-9]\\-[0-9][0-9]\\-[0-9][0-9]$",
			   message = "시작 일자가 올바른 형식이 아닙니다.")
	@ApiModelProperty(value="검색 시작일", example = "2020-01-01")
	private String startDate;
	
	@Pattern(regexp ="^[0-9][0-9][0-9][0-9]\\-[0-9][0-9]\\-[0-9][0-9]$",
			   message = "끝 일자가 올바른 형식이 아닙니다.")
	@ApiModelProperty(value="검색 마지막일", example = "2021-01-13")
	private String endDate;
	
	@NotNull
	@ApiModelProperty(value="검색 유형", example = "uid")
	private String searchType;
	
	@NotNull
	@ApiModelProperty(value="검색어", example = "0")
	private String searchWord;
	
}
