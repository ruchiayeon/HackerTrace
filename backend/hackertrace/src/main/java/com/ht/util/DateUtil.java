package com.ht.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

import org.apache.commons.lang3.time.DateUtils;

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
	
	public static String beforeDateDayUnit(String date, String monthTerm) {

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
	
	public static String afterDateDayUnit(String date, String monthTerm) {

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
		cal.add(Calendar.DAY_OF_WEEK, +term);
		
		String beforeEndDate = dateFormatter.format(cal.getTime());
		return beforeEndDate;
	}
	
	public static String addSecondsDateTime(String date, int minuteTerm) {
		
		SimpleDateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");

		Date startDate = new Date();
		try {
			startDate = dateFormatter.parse(date);
		} catch (ParseException e) {
			e.printStackTrace();
		}
		
		Date addTimeDate = DateUtils.addSeconds(startDate, minuteTerm);
		
		return dateFormatter.format(addTimeDate);
		
	}
	
	public static String getTodayDate() {
		SimpleDateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd");
		
		Calendar time = Calendar.getInstance();
		return dateFormatter.format(time.getTime());
	}
	
	public static String getCurrentTime() {
		SimpleDateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		
		Calendar time = Calendar.getInstance();
		return dateFormatter.format(time.getTime());
	}
	
	public static String getCurrentMilleTime() {
		SimpleDateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss.SSS");
		
		Calendar time = Calendar.getInstance();
		return dateFormatter.format(time.getTime());
	}
	
	public static String getDateDay(String date) throws Exception {
		 
	     
	    String day = "" ;
	     
	    SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
	    Date nDate = dateFormat.parse(date) ;
	     
	    Calendar cal = Calendar.getInstance() ;
	    cal.setTime(nDate);
	     
	    int dayNum = cal.get(Calendar.DAY_OF_WEEK) ;
	     
	     
	     
	    switch(dayNum){
	        case 1:
	            day = "일";
	            break ;
	        case 2:
	            day = "월";
	            break ;
	        case 3:
	            day = "화";
	            break ;
	        case 4:
	            day = "수";
	            break ;
	        case 5:
	            day = "목";
	            break ;
	        case 6:
	            day = "금";
	            break ;
	        case 7:
	            day = "토";
	            break ;
	             
	    }
	     
	     
	     
	    return day ;
	}



}
