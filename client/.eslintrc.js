module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    'import/no-unresolved': [
      2,
      { ignore: ['(src|screens|components|images)'] },
    ],
    'max-len': [2, { code: 80, tabWidth: 2, ignoreUrls: true }],
    // max lines in single js/jsx file
    'max-lines': ['error', { skipBlankLines: true, skipComments: true }],
    // disable .jsx extensions for files with jsx
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
  },
  settings: {
    'import/extensions': ['.js', '.jsx'],
    'import/resolver': {
      'directory-named': {
        aliases: {
          src: './src',
          screens: './src/screens',
          components: './src/components',
          images: './src/images',
        },
        extensions: ['.js'],
      },
    },
  },
};
