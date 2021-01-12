package com.smt.vo;

import java.util.List;

import javax.validation.constraints.Pattern;

import org.springframework.data.mongodb.core.mapping.Document;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuditLogVO {

	@Pattern(regexp = "^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$")
	private String hostIp;
	private String type;
	private String node;
	private String msg;
	private String time;
	private String arch;
	private Integer syscall;
	private String success;
	private Integer exit; 
	private List<String> arguments; //a0 ~ aN
	private Integer items; 
	private Integer ppid; 
	private Integer pid; 
	private Integer auid;
	private Integer uid; 
	private Integer gid; 
	private Integer euid; 
	private Integer suid; 
	private Integer fsuid; 
	private Integer egid; 
	private Integer sgid;
	private Integer fsgind; 
	private String tty; 
	private String ses; 
	private String comm; 
	private String exe; 
	private String subj; 
	private String key;
	private String proctitle;
	private String name;
	
}
