package com.smt.vo;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MemberVO  {
	
	@NotNull
	@NotBlank
	@ApiModelProperty(value="사용자 아이디", example = "test1234")
	private String userId;
	
	@NotNull
	@NotBlank
	@Pattern(
	   regexp="^(?=.*[A-Za-z])(?=.*\\d)(?=.*[$@$!%*#?&])[A-Za-z\\d$@$!%*#?&]{8,}$",
       message = "비밀번호는 최소 8자리 이상, 숫자, 문자, 특수문자 각각 1개 이상 포함해야함니다.")
	@ApiModelProperty(value="사용자 패스워드", example = "test1234")
	private String password;

}
