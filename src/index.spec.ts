import { expect } from 'chai';
import { createSandbox } from 'sinon';
import shuffle from './';
import niave from './niave';

describe('shuffle', () => {
  let sandbox;

  beforeEach(() => {
    sandbox = createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('base case', () => {
    it('returns empty list for no weights', () => {
      expect(shuffle({})).to.eql([]);
    });

    it('returns key for single list', () => {
      expect(shuffle({ a: 1 })).to.eql(['a']);
    });
  });

  describe('inductive case', () => {
    const MIN = 1 / (Math.pow(10, 16));
    const weights = { a: 1, b: 98, c: 1 };

    it('produces list opposite results', () => {
      const random = sandbox.stub(Math, 'random');

      // Test low bound extreme.
      random.returns(0);
      const ordered = shuffle(weights);

      // Test high bound extreme.
      random.returns(1 - MIN);
      const reversed = shuffle(weights);

      expect(ordered).to.eql(reversed.reverse());
    });

    it('pulls numbers based on remaining weight in the list', () => {
      const random = sandbox.stub(Math, 'random');
      random.onCall(0).returns(0.5);
      expect(shuffle(weights)).to.eql(['b', 'c', 'a']);
    });
  });

  describe('correctness', () => {
    const RUNS = 50;
    const WEIGHTS = 10;
    const MAX_WEIGHT = 5;

    it('produces same results as niave method', () => {
      for (let i = 0; i < RUNS; i++) {
        const weights = {};
        const randomValues = [];

        for (let j = 0; j < WEIGHTS; j++) {
          weights[j] = Math.random() * MAX_WEIGHT;
          randomValues.push(Math.random());
        }

        const random = sandbox.stub(Math, 'random');

        // Ensure same value gets called for random on each iteration of picking for
        // shuffle and niave.
        for (let i = 0; i < WEIGHTS; i++) {
          random.onCall(i).returns(randomValues[i]);
          random.onCall(WEIGHTS + i).returns(randomValues[i]);
        }

        expect(shuffle(weights)).to.eql(niave(weights));

        // Restore random for next iteration.
        random.restore();
      }
    });
  });
});
