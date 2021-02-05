package com.smt.vo;

import io.swagger.annotations.ApiModelProperty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ConfigLogHistoryVO extends PagingVO {
	
	@ApiModelProperty(value="호스트 아이피", example = "210.114.19.179")
	private String hostIp; 
	
	@ApiModelProperty(value="파일 생성 시간", example = "2021-02-02 14:26:22")
	private String fileCreateDate;
	
	@ApiModelProperty(value="이전 로그 검색 기간(일단위)", example = "1")
	private String beforeTerm; 
	
	@ApiModelProperty(value="이후 로그 검색 기간(일단위)", example = "1")
	private String afterTerm;
	
	@ApiModelProperty(value="세션값", example = "3277")
	private String ses;

}
