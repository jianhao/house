module.exports = {
  root: true,
  env: {
    node: true,
    es6: true
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module'
  },
  plugins: ['import', 'simple-import-sort'],
  extends: [
    'eslint:recommended', // 使用 ESLint 的推荐规则
    'plugin:@typescript-eslint/recommended', // 使用 @typescript-eslint 插件推荐的 TypeScript
    'prettier', // 使用 eslint-config-prettier 屏蔽 eslint 与 prettier 冲突的规则
    'plugin:prettier/recommended' // eslint-plugin-prettier 提供的，将 prettier 规则作为 eslint 规则报告
  ],
  overrides: [
    {
      files: ['*.d.ts'],
      rules: {
        'no-unused-vars': 'off', // 在 .d.ts 文件中禁用 no-unused-vars
        'no-shadow': 'off' // 在 .d.ts 文件中禁用 no-shadow
      }
    },
    {
      files: ['src/plugins/*.ts'],
      rules: {
        'no-shadow': 'off', // 在插件文件中禁用 no-shadow，允许类型声明
        'no-unused-vars': 'off' // 在插件文件中禁用 no-unused-vars，允许类型声明
      }
    }
  ],
  rules: {
    // 规则级别: 2 = error, 1 = warning, 0 = off
    // 模块排序规则
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          // 所有导入放在一个组内，按照: node内置模块 > 外部依赖 > 内部模块(@/) > 父级模块(../) > 同级模块(./) > 样式文件
          ['^node:', '^@?\\w', '^@/', '^\\.\\.', '^\\.', '^.+\\.(css|scss|less|sass|styl)$']
        ]
      }
    ],
    'no-duplicate-imports': 'error', // 自动合并多条 import, 多条 export 不会合并，需要合并设置 includeExports 为 true
    'simple-import-sort/exports': 'warn', // 导出排序
    'prefer-template': 'error', // 使用字符串模版代替字符串拼接
    'no-shadow': 2, // 禁止声明同名变量
    '@typescript-eslint/no-require-imports': 'off', // 允许使用 require()
    '@typescript-eslint/explicit-module-boundary-types': 'off', // 允许函数返回类型推断
    // 禁止出现未使用过的表达式
    '@typescript-eslint/no-unused-expressions': [
      2,
      {
        allowShortCircuit: true, // 允许使用 a() || b 或 a && b()
        allowTernary: true, // 允许在表达式中使用三元运算符
        allowTaggedTemplates: true // 允许标记模板字符串
      }
    ],
    // 不允许使用 any，关闭
    '@typescript-eslint/no-explicit-any': 'off',
    // 未使用变量校验规则关闭，eslint 同等规则已详细配置
    '@typescript-eslint/no-unused-vars': 'off',
    // 代码中的命名约定，确保变量、函数、类、接口等命名风格的一致性, 关闭
    '@typescript-eslint/naming-convention': 'off',
    // 禁用 @ts-xxx 注释，关闭
    '@typescript-eslint/ban-ts-comment': 'off',
    // 对象键和值之间的空格
    'key-spacing': ['error', { beforeColon: false, afterColon: true }],
    // 在代码块（如函数、条件语句、循环等）前是否需要空格
    'space-before-blocks': ['error', 'always'],
    // 逗号前后的空格, 如在函数定义和函数调用时，逗号用于分隔参数
    'comma-spacing': ['error', { before: false, after: true }],
    'space-in-parens': ['error', 'never'], // 在圆括号内使用一致的空格
    // 禁止 function 定义中出现重名参数
    'no-dupe-args': 'error',
    'no-use-before-define': 'off',
    'space-infix-ops': 'error', // 要求操作符周围有空格
    'space-unary-ops': [2, { words: true, nonwords: false }], // 在一元操作符前后使用一致的空格
    'no-trailing-spaces': 2, // 禁用行尾空格
    'no-undef': 'off', // 禁止使用未定义的变量，ts 项目关闭
    // 注释规则
    'spaced-comment': [
      2,
      'always',
      {
        markers: ['global', 'globals', 'eslint', 'eslint-disable', '*package', '!', ',']
      }
    ],
    'no-unused-vars': [
      'warn',
      {
        vars: 'all', // 变量定义必须被使用
        args: 'none', // 对于函数形参不检测
        ignoreRestSiblings: true, // 对于剩余子项 fn(...args)，{a, b, ...coords} 不检测
        caughtErrors: 'none', // 忽略 catch 语句的参数使用，即 `catch (error)` 中的 `error` 可以不被使用
        argsIgnorePattern: '^_', // 忽略函数形参中以 `_` 开头的参数名, 例如 `function example(_arg)` 中的 `_arg` 可以不被使用。
        varsIgnorePattern: '^_' // 忽略变量名中以 `_` 开头的变量，例如 `const _unused = 42` 中的 `_unused` 可以不被使用。
      }
    ]
  }
};
