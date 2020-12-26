package com.smt.vo;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MitreAttackVO {
	

	private String name;
	private String description;
	private List<String> externalIds;
	private List<String> killChainPhases;
	private List<String> platforms;
	
}
