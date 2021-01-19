package com.smt.vo;

import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResultVO {

	@ApiModelProperty(value="결과 리턴 코드", example = "0")
	private Integer return_code;
	
	@ApiModelProperty(value="결과 리턴 메시지", example = "~~")
	private String msg;
	
	@ApiModelProperty(value="결과 데이터", example = "")
	private Object data;
	
}
