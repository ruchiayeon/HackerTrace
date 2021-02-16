package com.ht.vo;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginVO {
	
	@NotNull
	@NotBlank
	@ApiModelProperty(value="사용자 아이디", example = "test")
	private String userId;
	
	@NotNull
	@NotBlank
	@ApiModelProperty(value="사용자 패스워드", example = "1234")
	private String password;

}
