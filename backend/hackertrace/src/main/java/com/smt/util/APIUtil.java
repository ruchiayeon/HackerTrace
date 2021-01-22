package com.smt.util;

import com.smt.vo.ResultVO;

public class APIUtil {

	public static ResultVO resResult(Integer code, String msg, Object data) {
		ResultVO vo = new ResultVO();

		vo.setReturn_code(code);
		vo.setMsg(msg);
		if (data == null)
			vo.setData("");
		else
			vo.setData(data);
	
		return vo;
	}
}
