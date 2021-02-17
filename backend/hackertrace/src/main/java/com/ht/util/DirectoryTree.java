package com.ht.util;

import java.util.Map;

public class DirectoryTree {
	
	
public static void main(String[] args) {
		
		//파일 경로 목록을 Tree구조로
		String slist[] = new String[] { 
                "/mnt/sdcard/folder1/a/b/file1.file", 
                "/mnt/sdcard/folder1/a/b/file2.file", 
                "/mnt/sdcard/folder1/a/b/file3.file", 
                "/mnt/sdcard/folder1/a/b/file4.file",
                "/mnt/sdcard/folder1/a/b/file5.file", 
                "/mnt/sdcard/folder1/e/c/file6.file", 
                "/mnt/sdcard/folder2/d/file7.file", 
                "/mnt/sdcard/folder2/d/file8.file", 
                "/mnt/sdcard111/file9.file" 
        };
		
		final DirectoryNode directoryRootNode = createDirectoryTree(slist);
		Map<String,String> dirPathNode =  (Map<String, String>) directoryRootNode;
        System.out.println("serializeString : " + dirPathNode.toString());
		
	}

	public static DirectoryNode createDirectoryTree(final String[] list) {
		DirectoryNode treeRootNode = null;
		for (final String rawPath : list) {
			final String path = rawPath.startsWith("/") ? rawPath.substring(1) : rawPath;
			final String[] pathElements = path.split("/");
			DirectoryNode movingNode = null;
			for (final String pathElement : pathElements) {
				movingNode = new DirectoryNode(movingNode, pathElement);
			}

			if (treeRootNode == null) {
				treeRootNode = movingNode.getRoot();
			} else {
				treeRootNode.merge(movingNode.getRoot());
			}
		}

		return treeRootNode;
	}

}
