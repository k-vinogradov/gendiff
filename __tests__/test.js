import fs from 'fs';
import path from 'path';
import genDiff from '../src';

const getFixturePath = filename => path.join('__tests__', '__fixtures__', filename);

test.each([
  ["no 'after' file", 'simple_before.json', 'no_file'],
  ["no 'before' file", 'no_file', 'simple_after.json'],
])('%s', (name, beforeFileName, afterFileName) => {
  expect(() => genDiff(getFixturePath(beforeFileName), getFixturePath(afterFileName))).toThrow();
});

test.each([
  [
    'hierarchical json',
    'hierarchical_before.json',
    'hierarchical_after.json',
    'hierarchical_expected.txt',
  ],
  [
    'hierarchical yaml',
    'hierarchical_before.yml',
    'hierarchical_after.yml',
    'hierarchical_expected.txt',
  ],
  [
    'hierarchical ini',
    'hierarchical_before.ini',
    'hierarchical_after.ini',
    'hierarchical_expected.txt',
  ],
])('%s', (name, beforeFileName, afterFileName, expectedFileName) => {
  const beforeFilePath = getFixturePath(beforeFileName);
  const afterFilePath = getFixturePath(afterFileName);
  const expectedText = fs.readFileSync(getFixturePath(expectedFileName), 'utf8');
  expect(genDiff(beforeFilePath, afterFilePath)).toBe(expectedText);
});

test.each([
  [
    'hierarchical json (flat output)',
    'hierarchical_before.json',
    'hierarchical_after.json',
    'flat_hierarchical_expected.txt',
  ],
  [
    'hierarchical yaml (flat output)',
    'hierarchical_before.yml',
    'hierarchical_after.yml',
    'flat_hierarchical_expected.txt',
  ],
  [
    'hierarchical ini (flat output)',
    'hierarchical_before.ini',
    'hierarchical_after.ini',
    'flat_hierarchical_expected.txt',
  ],
])('%s', (name, beforeFileName, afterFileName, expectedFileName) => {
  const beforeFilePath = getFixturePath(beforeFileName);
  const afterFilePath = getFixturePath(afterFileName);
  const expectedText = fs.readFileSync(getFixturePath(expectedFileName), 'utf8');
  expect(genDiff(beforeFilePath, afterFilePath, 'flat')).toBe(expectedText);
});

test.each([
  [
    'hierarchical json (json output)',
    'hierarchical_before.json',
    'hierarchical_after.json',
    'hierarchical_expected.json',
  ],
  [
    'hierarchical yaml (json output)',
    'hierarchical_before.yml',
    'hierarchical_after.yml',
    'hierarchical_expected.json',
  ],
  [
    'hierarchical ini (json output)',
    'hierarchical_before.ini',
    'hierarchical_after.ini',
    'hierarchical_expected.json',
  ],
])('%s', (name, beforeFileName, afterFileName, expectedFileName) => {
  const beforeFilePath = getFixturePath(beforeFileName);
  const afterFilePath = getFixturePath(afterFileName);
  const expectedValue = JSON.parse(fs.readFileSync(getFixturePath(expectedFileName), 'utf8'));
  const actualValue = JSON.parse(genDiff(beforeFilePath, afterFilePath, 'json'));
  expect(actualValue).toEqual(expectedValue);
});
