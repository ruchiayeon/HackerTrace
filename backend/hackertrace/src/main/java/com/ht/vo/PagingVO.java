package com.ht.vo;

import javax.validation.constraints.Positive;

import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PagingVO {
	
	@ApiModelProperty(value="페이지 번호", example = "1")
	@Positive
	private Integer pageNumber;
	
	@ApiModelProperty(value="페이지 당 보여지는 row 수", example = "50")
	@Positive
	private Integer pageSize;

}
