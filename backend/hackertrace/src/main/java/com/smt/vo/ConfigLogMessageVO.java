package com.smt.vo;

import javax.validation.constraints.Pattern;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ConfigLogMessageVO {
	
	@Pattern(regexp ="^\\\\\\\\/$|^((\\\\\\\\/([a-zA-Z0-9_-]+))+)$", message="")
	private String message; 
	
}
