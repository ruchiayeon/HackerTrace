package com.ht.vo;

import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MitreAuditConditionSesVO extends MitreAuditConditionVO {

	@ApiModelProperty(value="검색된 Uid", example = "1000")
	private String uid;
	
}
