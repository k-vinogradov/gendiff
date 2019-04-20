import yaml from 'js-yaml';
import ini from 'ini';
import _ from 'lodash';

const fixValue = (value) => {
  if (typeof value === 'boolean') return value;
  if (_.isNaN(Number(value))) return value;
  return Number(value);
};

const fixIniValues = object => _.toPairs(object).reduce((acc, [key, value]) => ({
  ...acc,
  [key]: _.isObject(value) ? fixIniValues(value) : fixValue(value),
}), {});

const parseIni = string => fixIniValues(ini.parse(string));

const parsers = {
  json: JSON.parse,
  yml: yaml.safeLoad,
  ini: parseIni,
};

const parse = (format, data) => parsers[format](data);

export default parse;
