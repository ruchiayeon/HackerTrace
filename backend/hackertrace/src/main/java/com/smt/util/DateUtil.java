package com.smt.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

public class DateUtil {

	public static String beforDateMonthUnit(String date, String monthTerm) {

		SimpleDateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd");

		Date startDate = new Date();
		try {
			startDate = dateFormatter.parse(date);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		
		Calendar cal = Calendar.getInstance();
		cal.setTime(startDate);
		Integer term = Integer.parseInt(monthTerm);
		cal.add(Calendar.MONTH, -term);
		
		String beforeEndDate = dateFormatter.format(cal.getTime());
		return beforeEndDate;
	}
	
	public static String beforDateDayUnit(String date, String monthTerm) {

		SimpleDateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd");

		Date startDate = new Date();
		try {
			startDate = dateFormatter.parse(date);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		
		Calendar cal = Calendar.getInstance();
		cal.setTime(startDate);
		Integer term = Integer.parseInt(monthTerm);
		cal.add(Calendar.DAY_OF_WEEK, -term);
		
		String beforeEndDate = dateFormatter.format(cal.getTime());
		return beforeEndDate;
	}
	
	
	public static String getTodayDate() {
		SimpleDateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd");
		
		Calendar time = Calendar.getInstance();
		return dateFormatter.format(time.getTime());
	}

}
