package com.smt.vo;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MemberVO  {
	
	@NotNull
	@NotBlank
	private String userId;
	
	@NotNull
	@NotBlank
	@Pattern(
	   regexp="^(?=.*[A-Za-z])(?=.*\\d)(?=.*[$@$!%*#?&])[A-Za-z\\d$@$!%*#?&]{8,}$",
       message = "비밀번호는 최소 8자리 이상, 숫자, 문자, 특수문자 각각 1개 이상 포함해야함니다.")
	private String password;

}
