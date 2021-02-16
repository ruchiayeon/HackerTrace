package com.ht.vo;

import java.util.List;

import javax.validation.constraints.Pattern;

import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuditLogVO {

	@Pattern(
			regexp = "^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$",
			message = "올바른 IP 형식이 아닙니다.")
	private String hostIp;
	private String type;
	private String node;
	private String msg;
	private String time;
	private String arch;
	private String syscall;
	private String success;
	private String exit; 
	private List<String> arguments; //a0 ~ aN
	private String items; 
	private String ppid; 
	private String pid; 
	private String auid;
	private String uid; 
	private String gid; 
	private String euid; 
	private String suid; 
	private String fsuid; 
	private String egid; 
	private String sgid;
	private String fsgind; 
	private String tty; 
	private String ses; 
	private String comm; 
	private String exe; 
	private String subj; 
	private String key;
	private String proctitle;
	private String name;
	
}
