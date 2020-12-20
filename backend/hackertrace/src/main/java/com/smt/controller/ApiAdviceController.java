package com.smt.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageConversionException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.smt.vo.ResultVO;

@RestControllerAdvice
public class ApiAdviceController {


    @ExceptionHandler(Exception.class) 
    @ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
    protected ResultVO defaultException(HttpServletRequest request, Exception e) {
    	ResultVO vo = new ResultVO();
    	vo.setErrCode(-100);
    	vo.setMsg("서버 에러가 발생하였습니다.");
        return vo;
    }
    
    
}
