type Tree = TreeNode | Leaf | null;

// TODO: Because the lookup time for javascript objects is questionable.
// Consider using fixed size arrays to contain the data.
interface TreeNode {
  type: 'node',
  size: number,
  left: Tree,
  right: Tree,

  // This is the weight of the entire left side.
  weight: number,

  // Since this value is expensive to update as nodes are deleted from the tree,
  // it is only used for construction. Therefore, it can only be trusted before the
  // first deletion.
  cumulativeWeight: number,
}

interface Leaf {
  type: 'leaf',
  size: 1,
  key: string,
  weight: number,
}

export interface WeightMap {
  [key: string]: number;
}

/**
 * Constructs a tree given a map of IDs to weights.
 */
export function constructTree(weights: WeightMap): Tree {
  // TODO: Adjust weights in case there are any negative values.
  const leafs: Leaf[] = Object.entries(weights).map(([key, weight]) => createLeaf(key, weight));

  if (leafs.length === 0) {
    return null;
  }

  // Construct by iteratively pairing adjacent nodes in the tree.
  // This results in O(nlog(n)) operations.
  return constructTreeFromNodes(leafs);
}

/**
 * Construct a tree by recursively pairing adjacent nodes in the list of nodes.
 * This results in O(nlog(n)) operations.
 */
function constructTreeFromNodes(nodes: TreeNode[] | Leaf[]): Tree {
  if (nodes.length === 1) {
    return nodes[0];
  }

  const newLength = Math.ceil(nodes.length / 2);
  const newNodes = new Array(newLength);

  for (let i = 0; i < newLength; i++) {
    const leftIndex = i * 2;
    const rightIndex = leftIndex + 1;

    if (rightIndex < nodes.length) {
      newNodes[i] = createTreeNode(nodes[leftIndex], nodes[rightIndex]);
    } else {
      newNodes[i] = nodes[leftIndex];
    }
  }

  return constructTreeFromNodes(newNodes);
}

function createLeaf(key: string, weight: number): Leaf {
  return { type: 'leaf', size: 1, key, weight };
}

function createTreeNode(left: Tree, right: Tree): TreeNode {
  const size = getSize(left) + getSize(right);
  const weight = getCumulative(left);
  const cumulativeWeight = weight + getCumulative(right);

  return { type: 'node', size: size, left, right, weight, cumulativeWeight };
}

function getSize(node: Tree): number {
  return node.size;
}

function getCumulative(node: Tree): number {
  if (node === null) {
    throw new Error('Cannot get cumulative weight of null.');
  }

  return node.type === 'leaf' ? node.weight : node.cumulativeWeight;
}

/**
 * Picks an element from the tree based on the value provided. Takes O(log(n)) time.
 *
 * @param {number} value - 0 or less will always pull the left most, while anything
 * greater than or equal to the sum of the nodes will always pull from the right.
 * @returns - Tuple of the leaf pulled and the new tree.
 */
export function pick(tree: Tree, value: number): [Leaf, Tree] {
  if (tree === null) {
    throw new Error('Cannot find value in empty tree.');
  }

  // The only remaining value is a leaf, return the tree.
  if (tree.type === 'leaf') {
    return [tree, null];
  }

  const moveLeft = value < tree.weight;

  // If the value is less than the left side, go left. Otherwise, subtract and go right.
  const [leaf, subtree] =
    moveLeft ? pick(tree.left, value) : pick(tree.right, value - tree.weight);

  // There is no subtree underneath? Promote the other node.
  if (subtree == null) {
    return [leaf, moveLeft ? tree.right : tree.left];
  }

  // If the subtree is not null, then the weights and sizes need to be adjusted.
  const size = tree.size - 1;

  if (moveLeft) {
    const weight = tree.weight - leaf.weight;
    return [leaf, { ...tree, size, weight, left: subtree }]
  } else {
    return [leaf, { ...tree, size, right: subtree }];
  }
}
