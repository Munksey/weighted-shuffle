import { constructTree, pick, WeightMap } from './tree';

const shuffle = (weights: WeightMap) : string[] => {
  let tree = constructTree(weights);

  const size = tree === null ? 0 : tree.size;
  const arr = new Array(size);

  // If the first type is a node, use the cumulative weight.
  let totalWeight = tree !== null && tree.type === 'node' ? tree.cumulativeWeight : 0;

  for (let i = 0; i < size; i++) {
    const value = Math.random() * totalWeight;
    const [leaf, newTree] = pick(tree, value);

    // Swap tree with the new tree.
    tree = newTree;

    // Subtract weight from the remaining total.
    totalWeight = totalWeight - leaf.weight;

    // Add the leaf key to the array.
    arr[i] = leaf.key;
  }

  return arr;
}

export default shuffle;
