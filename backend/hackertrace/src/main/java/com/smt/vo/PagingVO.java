package com.smt.vo;

import javax.validation.constraints.Positive;

import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PagingVO {
	
	@ApiModelProperty(example = "1")
	@Positive
	private Integer pageNumber;
	
	@ApiModelProperty(example = "50")
	@Positive
	private Integer pageSize;

}
