package com.smt.vo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResultVO {

	private Integer return_code;
	private String msg;
	private Object data;
	
}
