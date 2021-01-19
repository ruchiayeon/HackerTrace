package com.smt.vo;

import java.util.List;

import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MitreAttackVO {

	@ApiModelProperty(value="공격명")
	private String name;
	
	@ApiModelProperty(value="공격 설명")
	private String description;
	
	@ApiModelProperty(value="공격 아이디" )
	private List<String> externalIds;
	
	@ApiModelProperty(value="공격 단계")
	private List<String> killChainPhases;
	
	@ApiModelProperty(value="공격 지원 OS")
	private List<String> platforms;
	
}
