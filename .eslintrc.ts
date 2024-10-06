module.exports = {
    root: true,
    env: {
      node: true
    },
    extends: [
      "plugin:vue/vue3-essential",
      "eslint:recommended",
      // "@vue/typescript/recommended", // ts 支持
      "plugin:prettier/recommended",
    ],
    parserOptions: {
      parser: '@babel/eslint-parser'
    },
    overrides: [
      {
        files: ['**/__tests__/*.{j,t}s?(x)', '**/tests/unit/**/*.spec.{j,t}s?(x)'],
        env: {
          jest: true
        }
      }
    ],
    rules: {
      /*
      "off" 或 0 - 关闭规则
      "warn" 或 1 - 打开规则作为警告（不影响退出代码）
      "error" 或 2 - 打开规则作为错误（触发时退出代码为 1）
      */
      'array-bracket-spacing': [2, 'never'], // 在数组括号内强制保持一致的间距
      'block-spacing': [2, 'always'], // 在打开块之后和关闭块之前禁止或强制块内的空格
      'brace-style': [2, '1tbs'], // 对块执行一致的大括号样式
      'comma-dangle': [2, 'never'], // 不允许尾随逗号
      'comma-spacing': [
        2,
        {
          before: false,
          after: true
        }
      ], // 在逗号前后强制保持一致的间距
      'comma-style': [2, 'last'], // 强制使用一致的逗号样式
      'consistent-return': [
        2,
        {
          treatUndefinedAsUnspecified: true
        }
      ], // 要求 return 语句始终或从不指定值
      'computed-property-spacing': [2, 'never'], // 在计算的属性括号内强制执行一致的间距
      'constructor-super': 2, // 在构造函数中需要 super() 调用
      curly: 2, // 强制所有控制语句使用一致的括号风格
      'default-case': 2, // 在 switch 语句中需要 default 个案例
      'eol-last': [2, 'always'], // 在文件末尾要求或禁止换行
      'func-call-spacing': [2, 'never'], // 要求或不允许函数标识符及其调用之间有间距
      'guard-for-in': 2, // 要求 for-in 循环包含 if 语句
      indent: [
         2,
         2,
         {
           SwitchCase: 1
         }
       ], // 强制一致的缩进
      'jsx-quotes': [2, 'prefer-double'], // 强制在 JSX 属性中一致地使用双引号或单引号
      'key-spacing': [
        2,
        {
          beforeColon: false,
          afterColon: true
        }
      ], // 在对象字面属性中强制键和值之间的间距一致
      'new-cap': 0, // 设置名字首字母为大写的函数可以不为构造函数
      /* 'new-cap': [
        2,
        {
          newIsCap: true,
          capIsNewExceptionPattern: '(Type[a-zA-Z0-9]+|Deco[a-zA-Z0-9]+)+'
        }
      ], */
      'new-parens': 2, // 在调用不带参数的构造函数时强制或禁止使用括号
      'no-case-declarations': 2, // 不允许在case/default子句中使用词法声明
      'no-class-assign': 2, // 不允许重新分配类成员
      'no-compare-neg-zero': 2, // 禁止与 -0 进行比较
      'no-cond-assign': [2, 'always'], // 禁止条件语句中出现赋值操作符
      'no-console': 0, // 允许出现console
      'no-const-assign': 2, // 建议使用const
      'no-constant-condition': 2, // 禁止在条件中使用常量表达式
      'no-control-regex': 2, // 禁止在正则表达式中使用控制字符
      'no-debugger': 0, // 可以使用debugger
      'no-delete-var': 2, // 不允许删除变量
      'no-dupe-args': 2, // 禁止 function 定义中出现重名参数
      'no-dupe-class-members': 2, // 禁止重复的类成员
      'no-dupe-keys': 2, // 禁止对象字面量中出现重复的 key
      'no-duplicate-case': 2, // 禁止出现重复的 case 标签
      'no-empty': 2, // 禁止出现空语句块
      'no-empty-character-class': 2, // 禁止在正则表达式中使用空字符集
      'no-empty-pattern': 2, // 禁止空的解构模式
      'no-ex-assign': 2, // 禁止对 catch 子句的参数重新赋值
      'no-extra-boolean-cast': 2, // 禁止不必要的布尔转换
      'no-extra-parens': [2, 'functions'], // 禁止不必要的括号
      'no-extra-semi': 0, // 取消禁止不必要的分号
      'no-fallthrough': 2, // 不允许 case 语句的失败
      'no-func-assign': 2, // 禁止对 function 声明重新赋值
      'no-global-assign': [
        2,
        {
          exceptions: []
        }
      ], // 不允许分配给原生对象或只读全局变量
      'no-inner-declarations': 0, // 禁止在嵌套的块中出现变量声明或 function 声明
      'no-invalid-regexp': 2, // 禁止 RegExp 构造函数中存在无效的正则表达式字符串
      'no-irregular-whitespace': 2, // 禁止不规则的空白
      'no-mixed-spaces-and-tabs': 2, // 不允许使用混合空格和制表符进行缩进
      'no-multi-assign': 2, // 禁止使用链式赋值表达式
      'no-multiple-empty-lines': 2, // 禁止多个空行
      'no-new-symbol': 2, // 禁止带有 Symbol 对象的 new 运算符
      'no-obj-calls': 2, // 禁止把全局对象作为函数调用
      'no-octal': 2, // 禁止八进制字面
      'no-prototype-builtins': 2, // 禁止直接调用 Object.prototypes 的内置属性
      'no-redeclare': 2, // 禁止变量重新声明
      'no-regex-spaces': 2, // 禁止正则表达式字面量中出现多个空格
      'no-self-assign': 2, // 禁止两边完全相同的赋值
      'no-sparse-arrays': 2, // 禁用稀疏数组
      'no-template-curly-in-string': 0, // 禁止在常规字符串中出现模板字面量占位符语法
      'no-this-before-super': 2, // 在构造函数中调用 super() 之前禁止 this/super
      'no-undef': 0, // 除非在 /*global */ 注释中提及，否则不允许使用未声明的变量
      'no-undefined': 0, // 禁止使用 undefined 作为标识符
      'no-unexpected-multiline': 2, // 禁止出现令人困惑的多行表达式
      'no-unreachable': 2, // 禁止在 return、throw、continue 和 break 语句之后出现不可达代码
      'no-unsafe-finally': 2, // 禁止在 finally 语句块中出现控制流语句
      'no-unsafe-negation': 2, // 禁止对关系运算符的左操作数使用否定操作符
      'no-unused-labels': 2, // 禁止未使用的标签
      'no-use-before-define': 2, // 在定义之前禁止使用变量
      'no-useless-escape': 2, // 禁止不必要的转义字符
      'no-var': 2, // 禁止使用var
      'prefer-const': 2, // 声明后从不重新分配的变量需要 const 声明
      quotes: 0, // 双引号可无
      'require-yield': 2, // 要求生成器函数包含 yield
      semi: 0, // 句尾省略分号
      'space-before-function-paren': 0, // 在函数括号之前不使用间距
      strict: 2, // 要求或禁止严格模式指令
      'use-isnan': 2, // 要求使用 isNaN() 检查 NaN
      'valid-jsdoc': 0, // 强制执行有效且一致的 JSDoc 注释
      'valid-typeof': 2, // 强制 typeof 表达式与有效的字符串进行比较
      'vue/html-self-closing': [
        2,
        {
          html: {
            void: 'always',
            normal: 'always',
            component: 'always'
          },
          svg: 'always',
          math: 'always'
        }
      ], // 设置自闭合标签
      /* <template>
          <!-- ✓ GOOD -->
          <div/>
          <img/>
          <MyComponent/>
          <svg><path d=""/></svg>
  
          <!-- ✗ BAD -->
          <div></div>
          <img>
          <MyComponent></MyComponent>
          <svg><path d=""></path></svg>
        </template>
      */
      'vue/max-attributes-per-line': [
        1,
        {
          singleline: {
            max: 1
          },
          multiline: {
            max: 1
          }
        }
      ], // vue/每行最大属性 在单行情况下可接受的属性数量可配置（默认值为 1），在多行情况下，每行可接受的属性数量可配置（默认值 1）。
      'vue/singleline-html-element-content-newline': 0 // 在单行元素的内容之前和之后强制使用换行符
    },
  }
  
  
  