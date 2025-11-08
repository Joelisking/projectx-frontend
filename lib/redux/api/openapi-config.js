const config = {
  schemaFile: `http://localhost:8000/api/docs/?format=openapi`,
  apiFile: './index.ts',
  apiImport: 'api',
  outputFile: 'openapi.generated.ts',
  exportName: 'api',
  hooks: {
    queries: true,
    lazyQueries: true,
    mutations: true,
  },
  tag: true,
};

module.exports = config;