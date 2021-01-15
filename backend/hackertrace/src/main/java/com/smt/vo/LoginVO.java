package com.smt.vo;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginVO {
	
	@NotNull
	@NotBlank
	private String userId;
	
	@NotNull
	@NotBlank
	private String password;

}
