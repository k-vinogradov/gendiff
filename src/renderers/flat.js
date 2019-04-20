import _ from 'lodash';

const stringifyValue = (value) => {
  if (_.isObject(value)) return '[complex object]';
  if (_.isNaN(Number(value))) return `'${value}'`;
  return value;
};

const renderAddedNode = ({ key, value }, rootPath) => {
  const path = [...rootPath, key].join('.');
  return `Property '${path}' was added with value: ${stringifyValue(value)}`;
};

const renderRemovedNode = ({ key }, rootPath) => `Property '${[...rootPath, key].join('.')}' was removed`;

const renderModifiedNode = ({ key, originValue, newValue }, rootPath) => {
  const originValueStr = stringifyValue(originValue);
  const newValueStr = stringifyValue(newValue);
  return `Property '${[...rootPath, key].join('.')}' was updated. From ${originValueStr} to ${newValueStr}`;
};

const renderUnmodifiedNode = () => null;

const renderSubtreeNode = ({ key, children }, rootPath, render) => (
  render(children, [...rootPath, key])
);

const renderersMap = {
  added: renderAddedNode,
  removed: renderRemovedNode,
  modified: renderModifiedNode,
  unmodified: renderUnmodifiedNode,
  subtree: renderSubtreeNode,
};

const renderNode = (node, rootPath, render) => renderersMap[node.nodeType](node, rootPath, render);

const render = (tree, rootPath = []) => tree
  .map(node => renderNode(node, rootPath, render))
  .filter(string => string)
  .join('\n');

export default render;
