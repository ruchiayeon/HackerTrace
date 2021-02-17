package com.ht.util;

import java.util.LinkedHashSet;
import java.util.Objects;
import java.util.Set;

public class DirectoryNode {

	private final Set<DirectoryNode> children = new LinkedHashSet<>();

	private final String value;

	private final DirectoryNode parent;

	public DirectoryNode(final DirectoryNode parent, final String value) {
		this.parent = parent;
		if (this.parent != null) {
			this.parent.children.add(this);
		}

		this.value = value;
	}

	public Set<DirectoryNode> getChildren() {
		return this.children;
	}

	public String getValue() {
		return this.value;
	}

	public DirectoryNode getParent() {
		return this.parent;
	}

	public int getLeafCount() {
		int leafCount = this.isLeaf() ? 1 : 0;
		for (final DirectoryNode child : this.children) {
			leafCount += child.getLeafCount();
		}

		return leafCount;
	}

	public boolean isLeaf() {
		return this.children.isEmpty();
	}

	public DirectoryNode getRoot() {
		return this.parent == null ? this : this.parent.getRoot();
	}

	public void merge(final DirectoryNode that) {
		if (!this.value.equals(that.value)) {
			return;
		} else if (this.children.isEmpty()) {
			this.children.addAll(that.children);
			return;
		}

		final DirectoryNode[] thisChildren = this.children.toArray(new DirectoryNode[this.children.size()]);
		for (final DirectoryNode thisChild : thisChildren) {
			for (final DirectoryNode thatChild : that.children) {
				if (thisChild.value.equals(thatChild.value)) {
					thisChild.merge(thatChild);
				} else if (!this.children.contains(thatChild)) {
					this.children.add(thatChild);
				}
			}
		}
	}

	@Override
	public boolean equals(final Object o) {
		if (this == o) {
			return true;
		}
		if (o == null || getClass() != o.getClass()) {
			return false;
		}
		final DirectoryNode that = (DirectoryNode) o;
		return Objects.equals(this.value, that.value) && Objects.equals(this.parent, that.parent);
	}

	@Override
	public int hashCode() {
		return Objects.hash(this.value, this.parent);
	}

	@Override
	public String toString() {
		return "{" +"name=" + this.value  + ",children=" + this.children+ "}" ;
	}
	
//	public Map<String, String> getDocument() {
//		Map<String, Object> map = new HashMap<String,String>();
//		map.put("name", this.value);
//		map.put("children", this.children);
//		return map;
//	}
	
}