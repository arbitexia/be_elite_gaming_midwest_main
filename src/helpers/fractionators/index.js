import path from 'path';

const fractionateHelper = async (schemaName) => {
  const loadedModule = await import(path.join(__dirname, `${schemaName}-helper.js`));
  return loadedModule;
};

export default fractionateHelper;
