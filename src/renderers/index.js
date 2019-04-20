import structuredRender from './structured';
import flatRender from './flat';

const renderers = {
  structured: structuredRender,
  flat: flatRender,
  json: JSON.stringify,
};

const render = (format, ast) => renderers[format](ast);

export default render;
