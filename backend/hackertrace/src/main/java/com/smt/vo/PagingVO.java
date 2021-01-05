package com.smt.vo;

import javax.validation.constraints.Positive;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PagingVO {
	
	@Positive
	private Integer pageNumber;
	@Positive
	private Integer pageSize;

}
