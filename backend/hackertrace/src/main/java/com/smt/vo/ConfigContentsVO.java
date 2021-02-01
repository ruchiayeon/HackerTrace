package com.smt.vo;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;

import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ConfigContentsVO {
	
	@NotEmpty
	@NotNull
	@ApiModelProperty(value="Object 아이디", example = "6012711b5ea31b40f4e76073")
	private String objId;

}
