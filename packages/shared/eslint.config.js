import baseConfig from '@portfolio-tracker/eslint-config/base';

export default [
  ...baseConfig,
  {
    ignores: ['node_modules/**', 'dist/**'],
  },
];
