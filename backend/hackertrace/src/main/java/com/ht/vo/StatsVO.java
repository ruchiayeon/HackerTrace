package com.ht.vo;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class StatsVO {
	
	String type;
	String hostIp;
	String updateTime; //업데이트 시간
	String createDate; //생성 시간
	Object statsInfo;

}
