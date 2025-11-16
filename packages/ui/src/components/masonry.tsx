"use client";

import { Slot } from "@radix-ui/react-slot";
import React, { useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useComposedRefs } from "../lib/compose-refs";

const NODE_COLOR = {
	RED: 0,
	BLACK: 1,
	SENTINEL: 2,
} as const;

const NODE_OPERATION = {
	REMOVE: 0,
	PRESERVE: 1,
} as const;

type NodeColor = (typeof NODE_COLOR)[keyof typeof NODE_COLOR];
type NodeOperation = (typeof NODE_OPERATION)[keyof typeof NODE_OPERATION];

interface ListNode {
	index: number;
	high: number;
	next: ListNode | null;
}

interface TreeNode {
	max: number;
	low: number;
	high: number;
	color: NodeColor;
	parent: TreeNode;
	right: TreeNode;
	left: TreeNode;
	list: ListNode;
}

interface Tree {
	root: TreeNode;
	size: number;
}

function addInterval(treeNode: TreeNode, high: number, index: number): boolean {
	let node: ListNode | null = treeNode.list;
	let prevNode: ListNode | undefined;

	while (node) {
		if (node.index === index) return false;
		if (high > node.high) break;
		prevNode = node;
		node = node.next;
	}

	if (!prevNode) treeNode.list = { index, high, next: node };
	if (prevNode) prevNode.next = { index, high, next: prevNode.next };

	return true;
}

function removeInterval(
	treeNode: TreeNode,
	index: number,
): NodeOperation | undefined {
	let node: ListNode | null = treeNode.list;
	if (node.index === index) {
		if (node.next === null) return NODE_OPERATION.REMOVE;
		treeNode.list = node.next;
		return NODE_OPERATION.PRESERVE;
	}

	let prevNode: ListNode | undefined = node;
	node = node.next;

	while (node !== null) {
		if (node.index === index) {
			prevNode.next = node.next;
			return NODE_OPERATION.PRESERVE;
		}
		prevNode = node;
		node = node.next;
	}
}

const SENTINEL_NODE: TreeNode = {
	low: 0,
	max: 0,
	high: 0,
	color: NODE_COLOR.SENTINEL,
	parent: undefined as unknown as TreeNode,
	right: undefined as unknown as TreeNode,
	left: undefined as unknown as TreeNode,
	list: undefined as unknown as ListNode,
};

SENTINEL_NODE.parent = SENTINEL_NODE;
SENTINEL_NODE.left = SENTINEL_NODE;
SENTINEL_NODE.right = SENTINEL_NODE;

function updateMax(node: TreeNode) {
	const max = node.high;
	if (node.left === SENTINEL_NODE && node.right === SENTINEL_NODE)
		node.max = max;
	else if (node.left === SENTINEL_NODE)
		node.max = Math.max(node.right.max, max);
	else if (node.right === SENTINEL_NODE)
		node.max = Math.max(node.left.max, max);
	else node.max = Math.max(Math.max(node.left.max, node.right.max), max);
}

function updateMaxUp(node: TreeNode) {
	let x = node;

	while (x !== SENTINEL_NODE) {
		updateMax(x);
		x = x.parent;
	}
}

function rotateLeft(tree: Tree, node: TreeNode) {
	const y = node.right;
	node.right = y.left;

	if (y.left !== SENTINEL_NODE) {
		y.left.parent = node;
	}

	y.parent = node.parent;

	if (node.parent === SENTINEL_NODE) {
		tree.root = y;
	} else if (node === node.parent.left) {
		node.parent.left = y;
	} else {
		node.parent.right = y;
	}

	y.left = node;
	node.parent = y;

	updateMax(node);
	updateMax(y);
}

function rotateRight(tree: Tree, node: TreeNode) {
	const y = node.left;
	node.left = y.right;

	if (y.right !== SENTINEL_NODE) {
		y.right.parent = node;
	}

	y.parent = node.parent;

	if (node.parent === SENTINEL_NODE) {
		tree.root = y;
	} else if (node === node.parent.right) {
		node.parent.right = y;
	} else {
		node.parent.left = y;
	}

	y.right = node;
	node.parent = y;

	updateMax(node);
	updateMax(y);
}

function createTree(): Tree {
	return {
		root: SENTINEL_NODE,
		size: 0,
	};
}

function intervalSearch(tree: Tree, low: number): TreeNode | undefined {
	let x: TreeNode | undefined = tree.root;

	while (x !== SENTINEL_NODE && (low > x.high || low < x.low)) {
		if (x.left !== SENTINEL_NODE && x.left.max >= low) {
			x = x.left;
		} else {
			x = x.right;
		}
	}

	if (x === SENTINEL_NODE) return;
	return x;
}

function insertFixup(tree: Tree, node: TreeNode) {
	let z = node;

	while (z.parent.color === NODE_COLOR.RED) {
		if (z.parent === z.parent.parent.left) {
			const y = z.parent.parent.right;

			if (y.color === NODE_COLOR.RED) {
				z.parent.color = NODE_COLOR.BLACK;
				y.color = NODE_COLOR.BLACK;
				z.parent.parent.color = NODE_COLOR.RED;
				z = z.parent.parent;
			} else {
				if (z === z.parent.right) {
					z = z.parent;
					rotateLeft(tree, z);
				}

				z.parent.color = NODE_COLOR.BLACK;
				z.parent.parent.color = NODE_COLOR.RED;
				rotateRight(tree, z.parent.parent);
			}
		} else {
			const y = z.parent.parent.left;

			if (y.color === NODE_COLOR.RED) {
				z.parent.color = NODE_COLOR.BLACK;
				y.color = NODE_COLOR.BLACK;
				z.parent.parent.color = NODE_COLOR.RED;
				z = z.parent.parent;
			} else {
				if (z === z.parent.left) {
					z = z.parent;
					rotateRight(tree, z);
				}

				z.parent.color = NODE_COLOR.BLACK;
				z.parent.parent.color = NODE_COLOR.RED;
				rotateLeft(tree, z.parent.parent);
			}
		}
	}

	tree.root.color = NODE_COLOR.BLACK;
}

function insertNode(
	tree: Tree,
	low: number,
	high: number,
	index: number,
): boolean {
	let y: TreeNode = SENTINEL_NODE;
	let x: TreeNode | undefined = tree.root;

	while (x !== SENTINEL_NODE) {
		y = x;
		if (low < x.low) {
			x = x.left;
		} else if (low > x.low) {
			x = x.right;
		} else {
			return addInterval(x, high, index);
		}
	}

	const z: TreeNode = {
		low,
		high,
		max: high,
		parent: y,
		left: SENTINEL_NODE,
		right: SENTINEL_NODE,
		color: NODE_COLOR.RED,
		list: { index, high, next: null },
	};

	if (y === SENTINEL_NODE) {
		tree.root = z;
	} else if (z.low < y.low) {
		y.left = z;
	} else {
		y.right = z;
	}

	insertFixup(tree, z);
	updateMaxUp(z);
	tree.size++;

	return true;
}

function transplant(tree: Tree, u: TreeNode, v: TreeNode) {
	if (u.parent === SENTINEL_NODE) {
		tree.root = v;
	} else if (u === u.parent.left) {
		u.parent.left = v;
	} else {
		u.parent.right = v;
	}

	v.parent = u.parent;
}

function minimum(node: TreeNode): TreeNode {
	let x = node;

	while (x.left !== SENTINEL_NODE) {
		x = x.left;
	}

	return x;
}

function deleteFixup(tree: Tree, node: TreeNode) {
	let x = node;

	while (x !== tree.root && x.color === NODE_COLOR.BLACK) {
		if (x === x.parent.left) {
			let w = x.parent.right;

			if (w.color === NODE_COLOR.RED) {
				w.color = NODE_COLOR.BLACK;
				x.parent.color = NODE_COLOR.RED;
				rotateLeft(tree, x.parent);
				w = x.parent.right;
			}

			if (
				w.left.color === NODE_COLOR.BLACK &&
				w.right.color === NODE_COLOR.BLACK
			) {
				w.color = NODE_COLOR.RED;
				x = x.parent;
			} else {
				if (w.right.color === NODE_COLOR.BLACK) {
					w.left.color = NODE_COLOR.BLACK;
					w.color = NODE_COLOR.RED;
					rotateRight(tree, w);
					w = x.parent.right;
				}

				w.color = x.parent.color;
				x.parent.color = NODE_COLOR.BLACK;
				w.right.color = NODE_COLOR.BLACK;
				rotateLeft(tree, x.parent);
				x = tree.root;
			}
		} else {
			let w = x.parent.left;

			if (w.color === NODE_COLOR.RED) {
				w.color = NODE_COLOR.BLACK;
				x.parent.color = NODE_COLOR.RED;
				rotateRight(tree, x.parent);
				w = x.parent.left;
			}

			if (
				w.right.color === NODE_COLOR.BLACK &&
				w.left.color === NODE_COLOR.BLACK
			) {
				w.color = NODE_COLOR.RED;
				x = x.parent;
			} else {
				if (w.left.color === NODE_COLOR.BLACK) {
					w.right.color = NODE_COLOR.BLACK;
					w.color = NODE_COLOR.RED;
					rotateLeft(tree, w);
					w = x.parent.left;
				}

				w.color = x.parent.color;
				x.parent.color = NODE_COLOR.BLACK;
				w.left.color = NODE_COLOR.BLACK;
				rotateRight(tree, x.parent);
				x = tree.root;
			}
		}
	}

	x.color = NODE_COLOR.BLACK;
}

function deleteNode(tree: Tree, low: number, index: number): boolean {
	const z = intervalSearch(tree, low);
	if (!z) return false;

	const result = removeInterval(z, index);
	if (result === NODE_OPERATION.PRESERVE) return true;
	if (result === undefined) return false;

	let y = z;
	let yOriginalColor = y.color;
	let x: TreeNode;

	if (z.left === SENTINEL_NODE) {
		x = z.right;
		transplant(tree, z, z.right);
		updateMaxUp(x);
	} else if (z.right === SENTINEL_NODE) {
		x = z.left;
		transplant(tree, z, z.left);
		updateMaxUp(x);
	} else {
		y = minimum(z.right);
		yOriginalColor = y.color;
		x = y.right;

		if (y.parent === z) {
			x.parent = y;
		} else {
			transplant(tree, y, y.right);
			updateMaxUp(x);
			y.right = z.right;
			y.right.parent = y;
		}

		transplant(tree, z, y);
		y.left = z.left;
		y.left.parent = y;
		y.color = z.color;

		updateMax(y);
		updateMaxUp(y);
	}

	if (yOriginalColor === NODE_COLOR.BLACK) {
		deleteFixup(tree, x);
	}

	tree.size--;
	return true;
}

type Position = {
	left: number;
	top: number;
};

interface ColumnInterface {
	readonly columnWidth: number;
	readonly columnCount: number;
	readonly size: number;
	insert(index: number, size: number): void;
	delete(index: number): void;
	getShortestColumn(): number;
	getPosition(index: number): Position | undefined;
	estimateHeight(measuredCount: number, defaultItemHeight: number): number;
}

function createPositioner({
	columnWidth,
	columnCount,
	columnGap,
	rowGap,
	linear,
}: {
	columnWidth: number;
	columnCount: number;
	columnGap: number;
	rowGap: number;
	linear: boolean;
}): ColumnInterface {
	const columnHeights = new Array<number>(columnCount);
	const trees = new Array<Tree>(columnCount);

	for (let i = 0; i < columnCount; i++) {
		columnHeights[i] = 0;
		trees[i] = createTree();
	}

	let size = 0;
	let currentColumn = 0;

	function getShortestColumn(): number {
		let shortest = 0;

		for (let i = 1; i < columnCount; i++) {
			if (columnHeights[i] < columnHeights[shortest]) {
				shortest = i;
			}
		}

		return shortest;
	}

	function insert(index: number, itemHeight: number): void {
		const column = linear ? currentColumn : getShortestColumn();
		const top = columnHeights[column];
		const bottom = top + itemHeight;

		insertNode(trees[column], top, bottom, index);
		columnHeights[column] = bottom + rowGap;
		size++;

		if (linear) {
			currentColumn = (currentColumn + 1) % columnCount;
		}
	}

	function deleteItem(index: number): void {
		for (let column = 0; column < columnCount; column++) {
			const tree = trees[column];
			const deleted = deleteNode(tree, 0, index);

			if (deleted) {
				let maxHeight = 0;
				let x: TreeNode | undefined = tree.root;

				function traverse(node: TreeNode) {
					if (node === SENTINEL_NODE) return;
					traverse(node.left);

					let current: ListNode | null = node.list;
					while (current !== null) {
						if (current.high > maxHeight) {
							maxHeight = current.high;
						}
						current = current.next;
					}

					traverse(node.right);
				}

				traverse(x);
				columnHeights[column] = maxHeight > 0 ? maxHeight + rowGap : 0;
				size--;
				return;
			}
		}
	}

	function getPosition(index: number): Position | undefined {
		for (let column = 0; column < columnCount; column++) {
			const tree = trees[column];
			let x: TreeNode | undefined = tree.root;

			function search(node: TreeNode): Position | undefined {
				if (node === SENTINEL_NODE) return;

				const leftResult = search(node.left);
				if (leftResult) return leftResult;

				let current: ListNode | null = node.list;
				while (current !== null) {
					if (current.index === index) {
						return {
							left: column * (columnWidth + columnGap),
							top: node.low,
						};
					}
					current = current.next;
				}

				return search(node.right);
			}

			const result = search(x);
			if (result) return result;
		}
	}

	function estimateHeight(
		measuredCount: number,
		defaultItemHeight: number,
	): number {
		if (measuredCount === 0) return 0;

		let maxHeight = 0;
		for (let i = 0; i < columnCount; i++) {
			if (columnHeights[i] > maxHeight) {
				maxHeight = columnHeights[i];
			}
		}

		return maxHeight;
	}

	return {
		get columnWidth() {
			return columnWidth;
		},
		get columnCount() {
			return columnCount;
		},
		get size() {
			return size;
		},
		insert,
		delete: deleteItem,
		getShortestColumn,
		getPosition,
		estimateHeight,
	};
}

interface GapConfig {
	column?: number;
	row?: number;
}

interface MasonryContextValue {
	itemHeight: number;
	fallback?: React.ReactNode;
	positioner: ColumnInterface;
	isScrolling: boolean;
}

const MasonryContext = React.createContext<MasonryContextValue | null>(null);

function useMasonryContext() {
	const context = useContext(MasonryContext);
	if (!context) {
		throw new Error("Masonry components must be used within Masonry.Root");
	}
	return context;
}

type DivProps = React.ComponentPropsWithoutRef<"div">;

interface MasonryRootProps extends Omit<DivProps, "children"> {
	children?: React.ReactNode;
	columnWidth?: number;
	columnCount?: number;
	maxColumnCount?: number;
	gap?: GapConfig | number;
	itemHeight?: number;
	defaultWidth?: number;
	defaultHeight?: number;
	overscan?: number;
	scrollFps?: number;
	fallback?: React.ReactNode;
	linear?: boolean;
	asChild?: boolean;
}

function MasonryRoot(props: MasonryRootProps) {
	const {
		children,
		columnWidth: columnWidthProp,
		columnCount: columnCountProp,
		maxColumnCount = Number.POSITIVE_INFINITY,
		gap: gapProp = 0,
		itemHeight: itemHeightProp = 300,
		defaultWidth,
		defaultHeight,
		overscan = 2,
		scrollFps = 8,
		fallback,
		linear = false,
		asChild,
		style,
		ref,
		...viewportProps
	} = props;

	const RootPrimitive = asChild ? Slot : "div";

	const [mounted, setMounted] = useState(false);
	const [layoutVersion, setLayoutVersion] = useState(0);
	const layoutOutdated = useRef(false);
	const rafId = useRef<number | null>(null);

	const gap =
		typeof gapProp === "number"
			? { column: gapProp, row: gapProp }
			: { column: gapProp.column ?? 0, row: gapProp.row ?? 0 };

	const containerRef = useRef<HTMLDivElement>(null);
	const composedRefs = useComposedRefs(ref, containerRef);

	const [containerSize, setContainerSize] = useState({
		width: defaultWidth ?? 0,
		height: defaultHeight ?? 0,
	});

	useLayoutEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const updateSize = () => {
			const rect = container.getBoundingClientRect();
			setContainerSize({ width: rect.width, height: rect.height });
		};

		updateSize();
		setMounted(true);

		const resizeObserver = new ResizeObserver(updateSize);
		resizeObserver.observe(container);

		return () => {
			resizeObserver.disconnect();
		};
	}, []);

	const columnCount = useMemo(() => {
		if (columnCountProp !== undefined) {
			return Math.min(columnCountProp, maxColumnCount);
		}
		if (columnWidthProp !== undefined && containerSize.width > 0) {
			const count = Math.floor(
				(containerSize.width + gap.column) / (columnWidthProp + gap.column),
			);
			return Math.max(1, Math.min(count, maxColumnCount));
		}
		return 1;
	}, [
		columnCountProp,
		columnWidthProp,
		containerSize.width,
		gap.column,
		maxColumnCount,
	]);

	const columnWidth = useMemo(() => {
		if (columnWidthProp !== undefined) {
			return columnWidthProp;
		}
		const totalGaps = gap.column * (columnCount - 1);
		return (containerSize.width - totalGaps) / columnCount;
	}, [columnWidthProp, containerSize.width, gap.column, columnCount]);

	const positioner = useMemo(
		() =>
			createPositioner({
				columnWidth,
				columnCount,
				columnGap: gap.column,
				rowGap: gap.row,
				linear,
			}),
		[columnWidth, columnCount, gap.column, gap.row, linear],
	);

	const [isScrolling, setIsScrolling] = useState(false);
	const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	useEffect(() => {
		const handleScroll = () => {
			if (!isScrolling) {
				setIsScrolling(true);
			}

			if (scrollTimeoutRef.current) {
				clearTimeout(scrollTimeoutRef.current);
			}

			scrollTimeoutRef.current = setTimeout(() => {
				setIsScrolling(false);
			}, 1000 / scrollFps);
		};

		window.addEventListener("scroll", handleScroll, { passive: true });

		return () => {
			window.removeEventListener("scroll", handleScroll);
			if (scrollTimeoutRef.current) {
				clearTimeout(scrollTimeoutRef.current);
			}
		};
	}, [isScrolling, scrollFps]);

	const context = useMemo<MasonryContextValue>(
		() => ({
			itemHeight: itemHeightProp,
			fallback,
			positioner,
			isScrolling,
		}),
		[itemHeightProp, fallback, positioner, isScrolling],
	);

	const itemSizes = useRef(new Map<number, number>());
	const childrenArray = React.Children.toArray(children);
	const itemCount = childrenArray.length;
	const [measuredCount, setMeasuredCount] = useState(0);

	const positionedChildren = useMemo(() => {
		const items: React.ReactNode[] = [];
		const containerRect = containerRef.current?.getBoundingClientRect();
		const viewportTop = containerRect ? window.scrollY : 0;
		const viewportBottom = containerRect
			? viewportTop + window.innerHeight
			: Number.POSITIVE_INFINITY;

		for (let i = 0; i < itemCount; i++) {
			const child = childrenArray[i];
			const size = itemSizes.current.get(i);

			if (size !== undefined && positioner.size <= i) {
				positioner.insert(i, size);
				layoutOutdated.current = true;
			}

			const position = positioner.getPosition(i);

			if (!position) {
				items.push(
					<MeasureItem
						key={`measure-${i}`}
						index={i}
						onMeasure={(height) => {
							itemSizes.current.set(i, height);
							setMeasuredCount((prev) => prev + 1);
							layoutOutdated.current = true;
						}}
					>
						{child}
					</MeasureItem>,
				);
				continue;
			}

			const itemTop = position.top;
			const itemBottom = itemTop + (size ?? itemHeightProp);
			const shouldRender =
				itemTop < viewportBottom + overscan * itemHeightProp &&
				itemBottom > viewportTop - overscan * itemHeightProp;

			if (shouldRender || !mounted) {
				items.push(
					<div
						key={`item-${i}`}
						style={{
							position: "absolute",
							left: position.left,
							top: position.top,
							width: columnWidth,
						}}
					>
						{child}
					</div>,
				);
			}
		}

		return items;
	}, [
		childrenArray,
		itemCount,
		positioner,
		mounted,
		containerSize.width,
		containerSize.height,
		itemHeightProp,
		overscan,
		columnWidth,
		layoutVersion,
	]);

	useEffect(() => {
		const sizes = Array.from(itemSizes.current.entries());
		for (const [index] of sizes) {
			if (index >= itemCount) {
				itemSizes.current.delete(index);
				positioner.delete(index);
			}
		}
	}, [itemCount, positioner]);

	useEffect(() => {
		return () => {
			itemSizes.current.clear();
		};
	}, [columnCount, columnWidth, gap.column, gap.row]);

	useEffect(() => {
		itemSizes.current.forEach((size, index) => {
			if (positioner.size <= index) {
				positioner.insert(index, size);
			}
		});
	}, [positioner]);

	useEffect(() => {
		if (layoutOutdated.current && mounted) {
			if (rafId.current) {
				cancelAnimationFrame(rafId.current);
			}
			rafId.current = requestAnimationFrame(() => {
				setLayoutVersion((v) => v + 1);
				layoutOutdated.current = false;
			});
		}
		return () => {
			if (rafId.current) {
				cancelAnimationFrame(rafId.current);
			}
		};
	}, [layoutOutdated.current, mounted]);

	const estimatedHeight = useMemo(() => {
		const measuredHeight = context.positioner.estimateHeight(
			measuredCount,
			context.itemHeight,
		);
		if (measuredCount === itemCount) {
			return measuredHeight;
		}
		const remainingItems = itemCount - measuredCount;
		const estimatedRemainingHeight = Math.ceil(
			(remainingItems / context.positioner.columnCount) * context.itemHeight,
		);
		return measuredHeight + estimatedRemainingHeight;
	}, [context.positioner, context.itemHeight, measuredCount, itemCount]);

	const containerStyle = useMemo(
		() => ({
			position: "relative" as const,
			width: "100%",
			maxWidth: "100%",
			height: Math.ceil(estimatedHeight),
			maxHeight: Math.ceil(estimatedHeight),
			willChange: context.isScrolling ? "contents" : undefined,
			pointerEvents: context.isScrolling ? ("none" as const) : undefined,
			...style,
		}),
		[context.isScrolling, estimatedHeight, style],
	);

	if (!mounted && context.fallback) {
		return context.fallback;
	}

	return (
		<MasonryContext.Provider value={context}>
			<RootPrimitive
				{...viewportProps}
				ref={composedRefs}
				style={containerStyle}
				data-version={mounted ? layoutVersion : undefined}
			>
				{positionedChildren}
			</RootPrimitive>
		</MasonryContext.Provider>
	);
}

interface MeasureItemProps {
	index: number;
	onMeasure: (height: number) => void;
	children: React.ReactNode;
}

function MeasureItem({ index, onMeasure, children }: MeasureItemProps) {
	const ref = useRef<HTMLDivElement>(null);
	const measured = useRef(false);

	useLayoutEffect(() => {
		if (!measured.current && ref.current) {
			const height = ref.current.getBoundingClientRect().height;
			measured.current = true;
			onMeasure(height);
		}
	});

	return (
		<div
			ref={ref}
			style={{
				position: "absolute",
				visibility: "hidden",
				pointerEvents: "none",
			}}
		>
			{children}
		</div>
	);
}

interface MasonryItemProps extends DivProps {
	asChild?: boolean;
}

function MasonryItem(props: MasonryItemProps) {
	const { asChild, ...itemProps } = props;

	const ItemPrimitive = asChild ? Slot : "div";

	return <ItemPrimitive data-component="masonry-item" data-slot="masonry-item" {...itemProps} />;
}

const Root = MasonryRoot;
const Item = MasonryItem;

export { MasonryRoot, MasonryItem, Root, Item };





