package com.ht.util;

import java.io.UnsupportedEncodingException;

import org.apache.commons.codec.DecoderException;
import org.apache.commons.codec.binary.Hex;

import com.mongodb.BasicDBObject;

public class MogoDBUtil {

	public static BasicDBObject getDateTermFindQuery(String sDate, String eDate) {
		String startDate = sDate+" 00:00:00";
		String endDate = eDate+" 23:59:59";
		
		return  new BasicDBObject("$gte", startDate).append( "$lte" , endDate );
	}
	
	
	public static String hexStringToStr(String hexString) {

		byte[] bytes;
		String result = "";
		try {

			bytes = Hex.decodeHex(hexString.toCharArray());
			result = new String(bytes, "UTF-8");
			result = result.replaceAll("\\u0000", " ");

		} catch (Exception e) {
			return hexString;
		}

		return result;
	}
	
	public static void main(String[] args) throws DecoderException, UnsupportedEncodingException {
		
		String hexString = "2F7573722F7362696E2F73736864002D44";
	      
		System.out.println(hexStringToStr(hexString));
		
	}
}
