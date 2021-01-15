package com.smt.util;

import java.text.SimpleDateFormat;
import java.util.Date;

public class TimeUtils {

	public static String getAuditMsgToDate(String msg){
		
		String[] initMsgFormat = msg.split("\\:");
		String subMsgFormat = initMsgFormat[0].substring(6,initMsgFormat[0].length());
		String[] splitTimeFormat = subMsgFormat.split("\\.");
	    
		long timestamp = Long.parseLong(splitTimeFormat[0]);
	    Date date = new java.util.Date(timestamp*1000L); 
	    SimpleDateFormat sdf = new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm:ss"); 
	    sdf.setTimeZone(java.util.TimeZone.getTimeZone("GMT+9"));
	    
	    String formattedDate = sdf.format(date);
	    formattedDate += "."+splitTimeFormat[1];
	    
	    return formattedDate;
	}
	
}
