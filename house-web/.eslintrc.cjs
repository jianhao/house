module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
    'vue/setup-compiler-macros': true
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  plugins: ['import', 'simple-import-sort'],
  extends: [
    'plugin:vue/vue3-recommended',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'plugin:prettier/recommended'
  ],
  overrides: [
    {
      files: ['*.d.ts'],
      rules: {
        'no-unused-vars': 'off'
      }
    },
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module'
      }
    },
    {
      files: ['*.vue'],
      parser: 'vue-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        ecmaVersion: 2020,
        sourceType: 'module'
      }
    },
    {
      files: ['vite.config.ts', 'vite.config.js'],
      env: {
        node: true
      },
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module'
      }
    }
  ],
  rules: {
    // 模块排序规则
    'simple-import-sort/imports': [
      'error',
      {
        groups: [['^node:', '^@?\\w', '^@/', '^\\.\\.', '^\\.', '^.+\\.(css|scss|less|sass|styl)$']]
      }
    ],
    'no-duplicate-imports': 'error',
    'simple-import-sort/exports': 'warn',
    'prefer-template': 'error',
    'no-shadow': 2,
    '@typescript-eslint/no-require-imports': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-expressions': [
      2,
      {
        allowShortCircuit: true,
        allowTernary: true,
        allowTaggedTemplates: true
      }
    ],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/naming-convention': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    'key-spacing': ['error', { beforeColon: false, afterColon: true }],
    'space-before-blocks': ['error', 'always'],
    'comma-spacing': ['error', { before: false, after: true }],
    'space-in-parens': ['error', 'never'],
    'no-dupe-args': 'error',
    'no-use-before-define': 'off',
    'space-infix-ops': 'error',
    'space-unary-ops': [2, { words: true, nonwords: false }],
    'no-trailing-spaces': 2,
    'no-undef': 'off',
    'vue/html-indent': 0,
    'vue/multiline-html-element-content-newline': [
      'error',
      {
        ignoreWhenEmpty: true,
        ignores: ['pre', 'textarea'],
        allowEmptyLines: true
      }
    ],
    'spaced-comment': [
      2,
      'always',
      {
        markers: ['global', 'globals', 'eslint', 'eslint-disable', '*package', '!', ',']
      }
    ],
    'vue/max-attributes-per-line': 0,
    'vue/singleline-html-element-content-newline': 0,
    'vue/no-duplicate-attributes': [
      'error',
      {
        allowCoexistClass: true,
        allowCoexistStyle: true
      }
    ],
    'no-unused-vars': [
      'warn',
      {
        vars: 'all',
        args: 'none',
        ignoreRestSiblings: true,
        caughtErrors: 'none',
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }
    ],
    'vue/no-unused-vars': [
      'warn',
      {
        ignorePattern: '^_'
      }
    ],
    'vue/script-setup-uses-vars': 'error',
    'vue/custom-event-name-casing': 'off',
    'vue/attributes-order': 'off',
    'vue/one-component-per-file': 'off',
    'vue/attribute-hyphenation': 'off',
    'vue/require-default-prop': 'off',
    'vue/html-self-closing': [
      'error',
      {
        html: {
          void: 'always',
          normal: 'never',
          component: 'always'
        },
        svg: 'always',
        math: 'always'
      }
    ],
    'vue/v-on-event-hyphenation': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/component-definition-name-casing': 'off',
    'vue/no-ref-as-operand': 'warn',
    'vue/no-mutating-props': 'off'
  }
};
