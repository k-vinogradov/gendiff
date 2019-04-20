import _ from 'lodash';
import path from 'path';
import fs from 'fs';

import parse from './parsers';
import render from './renderers';

const getFormat = filePath => path.extname(filePath).slice(1);

const nodeTypes = [
  {
    check: (key, set1, set2) => typeof set1[key] === 'object' && typeof set2[key] === 'object',
    create: (key, set1, set2, buildTree) => ({
      key,
      nodeType: 'subtree',
      children: buildTree(set1[key], set2[key]),
    }),
  },
  {
    check: (key, set1) => !_.has(set1, key),
    create: (key, set1, set2) => ({
      key,
      nodeType: 'added',
      value: set2[key],
    }),
  },
  {
    check: (key, set1, set2) => !_.has(set2, key),
    create: (key, set1) => ({
      key,
      nodeType: 'removed',
      value: set1[key],
    }),
  },
  {
    check: (key, set1, set2) => set1[key] === set2[key],
    create: (key, set1) => ({
      key,
      nodeType: 'unmodified',
      value: set1[key],
    }),
  },
  {
    check: () => true,
    create: (key, set1, set2) => ({
      key,
      nodeType: 'modified',
      originValue: set1[key],
      newValue: set2[key],
    }),
  },
];

const createNode = (key, set1, set2, astBuilder) => {
  const nodeType = nodeTypes.find(({ check }) => check(key, set1, set2));
  return nodeType.create(key, set1, set2, astBuilder);
};

const buildTree = (set1, set2) => _.union(_.keys(set1), _.keys(set2)).reduce(
  (acc, key) => [...acc, createNode(key, set1, set2, buildTree)],
  [],
);

const genDiff = (filePath1, filePath2, outputFormat = 'structured') => {
  const obj1 = parse(getFormat(filePath1), fs.readFileSync(filePath1, 'utf8'));
  const obj2 = parse(getFormat(filePath2), fs.readFileSync(filePath2, 'utf8'));
  const ast = buildTree(obj1, obj2);
  return render(outputFormat, ast);
};

export default genDiff;
