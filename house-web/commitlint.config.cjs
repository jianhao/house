module.exports = {
  extends: ['@commitlint/config-conventional'],
  parserPreset: {
    parserOpts: {
      headerPattern: /^(.+?)(?:\((.*)\))?: (.+)$/,
      headerCorrespondence: ['type', 'scope', 'subject']
    }
  },
  rules: {
    'type-enum': [0, 'never'],
    'type-empty': [0, 'never'],
    'subject-empty': [0, 'never'],
    'subject-case': [0, 'never', ['sentence-case', 'start-case', 'pascal-case', 'upper-case']],
    'type-rule': [2, 'always'], // 自定义的 type 规则
    'subject-rule': [2, 'always'] // 自定义的 subject 规则
  },
  plugins: [
    {
      rules: {
        'type-rule': function (parsed) {
          var type = parsed.type;
          if (!['feat', 'fix', 'docs', 'style', 'refactor', 'test', 'chore', 'revert'].some(item => type?.endsWith(item))) {
            return [false, '提交类型应为以下之一: ✨feat, 🐛fix, 📚docs, 💄style, ♻️refactor, ✅test, 🚀chore, ⏪️revert)'];
          }
          return [true];
        },
        'subject-rule': function (parsed) {
          var subject = parsed.subject;

          if (!subject) {
            return [false, '请简要描述提交内容，例如: (✨feat: 添加 xx 功能, 🐛fix: 修复 xx bug, 📚docs: 更新文档)'];
          }

          return [true];
        }
      }
    }
  ]
};
