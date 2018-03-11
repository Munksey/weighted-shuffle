import { performance } from 'perf_hooks';
import shuffle from '../src/index';
import niave from '../src/niave';
import { shuffle as deckShuffle } from 'deck';

const SAMPLE_SIZES = [5, 10, 100, 1000, 10000];
const MAX_WEIGHT = 5;

for (let i = 0; i < SAMPLE_SIZES.length; i++) {
  const weights = {};

  for (let j = 0; j < SAMPLE_SIZES[i]; j++) {
    weights[j] = Math.random() * MAX_WEIGHT;
  }

  console.info(`Running deck size: ${SAMPLE_SIZES[i]}.\n`);

  [
    ['deck shuffle', deckShuffle],
    ['niave', niave],
    ['adjusted tree shuffle', shuffle]
  ].forEach(([name, callback]) => {
    const before = performance.now();
    callback(weights);
    const after = performance.now();
    const elapsed = after - before;
    console.info(`Time to run ${name}: ${elapsed}ms.`)

  });

  console.info('');
}
