import { expect } from 'chai';
import { constructTree, pick } from './tree';

describe('constructTree', () => {
  it('returns null', () => {
    expect(constructTree({})).to.equal(null);
  });

  it('returns a leaf', () => {
    expect(
      constructTree({ a: 1 })
    ).to.eql({
      type: 'leaf',
      size: 1,
      weight: 1,
      key: 'a',
    });
  });

  it('builds a tree node with an even number of nodes', () => {
    expect(
      constructTree({ a: 1, b: 2 })
    ).to.eql({
      type: 'node',
      size: 2,
      weight: 1,
      cumulativeWeight: 3,
      left: {
        type: 'leaf',
        size: 1,
        weight: 1,
        key: 'a',
      },
      right: {
        type: 'leaf',
        size: 1,
        weight: 2,
        key: 'b',
      }
    });
  });

  it('builds a tree with an odd number of nodes', () => {
    expect(
      constructTree({ a: 1, b: 2, c: 1 })
    ).to.eql({
      type: 'node',
      size: 3,
      weight: 3,
      cumulativeWeight: 4,
      left: {
        type: 'node',
        size: 2,
        weight: 1,
        cumulativeWeight: 3,
        left: {
          type: 'leaf',
          size: 1,
          weight: 1,
          key: 'a',
        },
        right: {
          type: 'leaf',
          size: 1,
          weight: 2,
          key: 'b',
        }
      },
      right: {
        type: 'leaf',
        size: 1,
        weight: 1,
        key: 'c',
      }
    });
  });
});

describe('pick', () => {
  it('throws an error', () => {
    const tree = constructTree({});
    expect(() => pick(tree, 0)).to.throw(/Cannot find value in empty tree./);
  });

  it('gets leaf and returns null for new tree', () => {
    const tree = constructTree({ a: 1 });
    expect(pick(tree, 0)).to.eql([{ type: 'leaf', size: 1, key: 'a', weight: 1 }, null]);
  });

  it('returns a new tree', () => {
    const tree = constructTree({ a: 1, b: 1, c: 1, d: 1 });

    expect(
      pick(tree, 3)
    ).to.eql([{
      type: 'leaf',
      size: 1,
      weight: 1,
      key: 'd',
    }, {
      type: 'node',
      size: 3,
      weight: 2,
      cumulativeWeight: 4,
      left: {
        type: 'node',
        size: 2,
        weight: 1,
        cumulativeWeight: 2,
        left: {
          type: 'leaf',
          size: 1,
          weight: 1,
          key: 'a',
        },
        right: {
          type: 'leaf',
          size: 1,
          weight: 1,
          key: 'b',
        }
      },
      right: {
        type: 'leaf',
        size: 1,
        weight: 1,
        key: 'c',
      }
    }]);
  });
});
