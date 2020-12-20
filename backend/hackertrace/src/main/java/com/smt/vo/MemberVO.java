package com.smt.vo;

import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;


@Getter
@Setter
public class MemberVO  {
	
	@NonNull
	private String userId;
	@NonNull
	private String password;

}
