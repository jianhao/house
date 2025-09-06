export default {
  customSyntax: 'postcss-html',
  extends: [
    'stylelint-config-standard',
    'stylelint-config-recommended',
    'stylelint-config-recommended-vue',
    'stylelint-config-rational-order',
    'stylelint-config-recommended-scss'
  ],
  plugins: ['stylelint-prettier'],
  ignoreFiles: ['dist/**', 'public/**', 'node_modules/**'],
  fix: true,
  overrides: [
    {
      files: ['**/*.scss'],
      customSyntax: 'postcss-scss'
    }
  ],
  rules: {
    'prettier/prettier': true,
    'no-invalid-position-at-import-rule': null,
    'import-notation': 'string',
    'scss/load-partial-extension': 'always',
    'alpha-value-notation': 'number',
    'no-descending-specificity': null,
    'selector-pseudo-class-no-unknown': [true, { ignorePseudoClasses: ['export', 'global', 'deep'] }],
    'selector-class-pattern': [
      '^[a-z]+([a-z0-9]*-[a-z0-9]+)*$',
      { message: 'Expected class selector to be kebab-case', severity: 'warning' }
    ],
    'declaration-property-value-no-unknown': null,
    'selector-type-no-unknown': [true, { ignore: ['custom-elements'] }]
  }
};
