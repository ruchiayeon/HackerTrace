package com.smt.util;

import com.mongodb.BasicDBObject;

public class MogoDBUtil {

	public static BasicDBObject getDateTermFindQuery(String keyName, String sDate, String eDate) {
		String startDate = sDate+" 00:00:00";
		String endDate = eDate+" 23:59:59";
		
		BasicDBObject findQuery = new BasicDBObject(keyName
				, new BasicDBObject("$gte", startDate)
				.append( "$lte" , endDate ) );
		return findQuery;
	}
}
