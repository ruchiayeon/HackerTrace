package com.ht.util;

import com.ht.vo.ResultVO;

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
	
	
//	public static List<Document> getPathListToJsonTree(List<String> pathList, int depth){
//		
//		 List<Document> result = new ArrayList<Document>(); 
//		
//		List<String> onlyNameList = new ArrayList<>();
//		for(String paths: pathList) {
//			
//			String[] splitPath = paths.split("\\/");
//			if(splitPath.length>0) {
//				if(!onlyNameList.contains(splitPath[1]))
//					onlyNameList.add(splitPath[1]);
//			}
//			
//		}
//		
//		List<Document> nextChildrenList = new ArrayList<Document>();
////		List<Document> nextChildrenList = new ArrayList<Document>();
//		for(String paths: pathList) {
//			String[] splitPath = paths.split("\\/");
//			if(splitPath.length>0) {
////				String newPath = "/";
////				for(int i= 2;i < splitPath.length-1; i++) {
////					newPath += splitPath[i]+"/";
////				}
////				newPath += splitPath[splitPath.length-1];
//////				System.out.println(newPath);
////				nextDepthList.add(newPath);
//				Document nextDepthDoc = new Document();
//				nextDepthDoc.put("name", splitPath[depth]);
//				nextDepthDoc.put("children", new ArrayList<>());
//				nextChildrenList.add(nextDepthDoc);
//			}
//			
//		}
//		
//		
//		Document resDoc = new Document();
//		for(String name : onlyNameList) {
//			resDoc.put("name", name);
//			resDoc.put("children", nextChildrenList);
//		}
//		
////		resDoc.put("nextDepth", nextDepthList);
//		result.add(resDoc);
//		return result;
//	}
	
	/**
	 * 
	 * {
      name: 'root',
      children: [
          {
              name: 'parent',
              children: [
                  { name: 'child1' },
                  { name: 'child2' }
              ]
          },
          {
              name: 'loading parent',
              children: []
          },
          {
              name: 'parent',
              children: [
                  {
                      name: 'nested parent',
                      children: [
                          { name: 'nested child 1'},
                          { name: 'nested child 2' }
                      ]
                  }
              ]
          }
      ]
  		}
	 * 
	 */
	
//	private static List<String> getSameDepthPathList(List<String> pathList, int depth,String beforePath) {
//		
//			List<String> onlyNameList = new ArrayList<>();
//			for(String paths: pathList) {
//				
//				String[] splitPath = paths.split("\\/");
//				if(splitPath.length>depth) {
//					if(beforePath == null) {
//						if(!onlyNameList.contains(splitPath[depth])) {
//							onlyNameList.add(splitPath[depth]);
//						}
//					}else {
//						
//						if(splitPath[depth-1].equals(beforePath)) {
//							if(!onlyNameList.contains(splitPath[depth])) {
//								onlyNameList.add(splitPath[depth]);
//							}
//						}
//						
//					}
//				}
//				
//			}
//			
//		return  onlyNameList;
//		
//	}
	
//	private static List<TreeNodeVO> getTreeNodeList(List<String> pathList, int depth, String beforePath ){
//		 List<TreeNodeVO> directoryContent = new ArrayList<>();
//		 
//		 for(String paths: pathList) {
//			 TreeNodeVO vo = new TreeNodeVO();
//				String[] splitPath = paths.split("\\/");
//				if(splitPath.length>depth) {
//					if(beforePath == null) {
//						vo.setName(splitPath[depth]);
//						
//					}else {
//						
//						if(splitPath[depth-1].equals(beforePath)) {
//							if(!onlyNameList.contains(splitPath[depth])) {
//								onlyNameList.add(splitPath[depth]);
//							}
//						}
//						
//					}
//				}
//				
//			}
//		 
//		 return directoryContent;
//		
//	}
	
	
	
	
}
