import { WeightMap } from "./tree";

/**
 * Niave approach of shuffling the tree.
 */
function niave(weights: WeightMap): string[] {
  const result = [];

  let totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);

  const mutableWeights = { ...weights };
  const keys = new Set(Object.keys(weights));

  while (keys.size > 0) {
    let point = Math.random() * totalWeight;

    let key;
    let weight;

    for ([key, weight] of Object.entries(mutableWeights)) {
      point = point - weight;

      if (point < 0) {
        break;
      }
    }

    result.push(key);

    totalWeight = totalWeight - weight;

    delete mutableWeights[key];
    keys.delete(key);
  }

  return result;
}

export default niave;
