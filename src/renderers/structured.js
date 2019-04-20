import _ from 'lodash';

const statusSymbols = {
  added: '+',
  removed: '-',
  unmodified: ' ',
};

const getIndent = level => ' '.repeat(level * 4);

const stringifyValue = (value, level) => {
  const stringifySubElement = ([key, val]) => {
    const indent = getIndent(level + 1);
    return `${indent}${key}: ${stringifyValue(val)}`;
  };

  const indent = getIndent(level);
  const lines = _.isObject(value)
    ? ['{', ..._.toPairs(value).map(stringifySubElement), `${indent}}`]
    : [value];
  return lines.join('\n');
};

const stringifyNode = (key, nodeType, value, level) => {
  const label = `${' '.repeat((level - 1) * 4)}  ${statusSymbols[nodeType]} ${key}`;
  return `${label}: ${stringifyValue(value, level)}`;
};

const renderersByNodeType = {
  added: ({ key, value }, level) => stringifyNode(key, 'added', value, level),
  removed: ({ key, value }, level) => stringifyNode(key, 'removed', value, level),
  modified: ({ key, originValue, newValue }, level) => [
    stringifyNode(key, 'removed', originValue, level),
    stringifyNode(key, 'added', newValue, level),
  ].join('\n'),
  unmodified: ({ key, value }, level) => stringifyNode(key, 'unmodified', value, level),
  subtree: ({ key, children }, level, renderTree) => {
    const indent = getIndent(level);
    return `${indent}${key}: ${renderTree(children, level + 1)}`;
  },
};

const renderNode = (node, lvl, render) => renderersByNodeType[node.nodeType](node, lvl, render);

const render = (tree, level = 1) => {
  const lines = [
    '{',
    ...tree.map(node => renderNode(node, level, render)),
    `${getIndent(level - 1)}}`,
  ];
  return lines.join('\n');
};

export default render;
