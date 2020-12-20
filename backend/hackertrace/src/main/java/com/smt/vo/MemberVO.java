package com.smt.vo;

import lombok.Getter;
import lombok.NonNull;
import lombok.Setter;
import lombok.ToString;


@Getter
@Setter
@ToString
public class MemberVO  {

	@NonNull
	private String userId;
	@NonNull
	private String password;

}
