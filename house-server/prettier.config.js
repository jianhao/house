module.exports = {
  arrowParens: 'avoid', // 箭头函数参数只有一个时，省略括号
  bracketSpacing: true, // 在对象字面量中的括号之间打印空格
  embeddedLanguageFormatting: 'auto', // 自动格式化嵌入的代码
  htmlWhitespaceSensitivity: 'css', // 根据 CSS 选择器的敏感度处理 HTML 中的空白
  insertPragma: false, // 不自动插入 @format 标记

  jsxSingleQuote: true, // 在 JSX 中使用单引号
  printWidth: 140, // 每行最大字符数为 140
  proseWrap: 'preserve', // 保留原始的 prose 包装
  quoteProps: 'as-needed', // 仅在需要时引用对象属性
  requirePragma: false, // 不要求文件顶部有 @format 标记
  semi: true, // 在语句末尾添加分号
  singleQuote: true, // 使用单引号
  tabWidth: 2, // 每个缩进级别的空格数为 2
  trailingComma: 'none', // 不使用尾随逗号
  useTabs: false, // 使用空格而不是制表符进行缩进
  endOfLine: 'auto' // 自动选择行尾字符（LF 或 CRLF）
};
