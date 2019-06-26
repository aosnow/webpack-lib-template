# 复杂业务联动表单简化工具库

## Project setup
```
npm install @mudas/payset -S
```

### README
```

配置项规则
------------------------------------------------------------------------------

{项配置}
标识名: {
  type（暂不支持）: 表单控件类型 text/select/checkboxgroup/radiogroup,
  value: 默认值,
  rule: 联动规则,
  master: 首次初始化主动触发默认值事件，以初始化后续连带事务
}

------------------------------------------------------------------------------

{rule 配置}
{ 值1：表现, 值2：表现, 值N：表现 }

【表现分为】
  value              - 指定值，与 [value, 'custom'] 等价，并且可由用户选择
  'custom'           - 设置为默认值（value 指定，若未设置则由系统指定），并且可由用户选择
  'hide'             - 直接隐藏，保持原有值
  'required'         - 设置必填字段，保持原有值
  'disabled'         - 直接禁用，保持原有值
  [value, display]   - 强制设置为 value 指定的值，并且应用指定的视觉显示规则，display: hide-隐藏，disabled-禁用，custom-可选
                       display 支持多个显示规则，如 [value, 'required', 'custom']

  {}                 - 次级关注组件，规则同上（复合规则，最终由最底层规则确定表现），若有多个字段规则，则任意取其中一个成立规则的子规则,
                       若同时成立取第一个满足条件的字段规则的子规则。（警告：该方式不支持同级多条件的关系处理，请使用函数联动规则）

【特殊联动函数】
  用以补充需要同时依赖多个值来决定表现的情况。

  1、function(value, model){}
  value - 监听目标当前的值
  model - 包含其它属性的数据集合模型，可从中取出目标字段当前的值，做为其它条件依据

  通过函数的形式返回规则配置值，而不是通过值列表的形式由系统选择。
  该方式可以返回更复杂的配置结果，主要用于无法通过值匹配（单条件A）拿规则的情况，比如需要通过另一个条件（条件B）或更多条件，来共同决定之间是
  “and, or”等复杂逻辑关系时，可以解决该需求。

  2、{watch:[], handler:function(value, model){}}
  handler 类型的监听器，补充 function 类型监听器的不足
  function 类型只适用于在最底层级监听单个目标字段，而 handler 可以任意层级通过 watch 监听多个目标字段
  该类型会监听 watch 列表中的字段以及目标字段，如下所示：

    rule: {
      merchant_business_type: {
        watch: ['account_type', 'license_type'],
        handler(value, model) {}
      }
    }

  该规则会对3个目标的变化作出响应：merchant_business_type、account_type、license_type
  所以在 watch 列表中无须重复加入 merchant_business_type 这个监听目标

【注意事项】
  若当前字段值，被后续字段依赖，则必须设置为具体的值，不论是 hide、disabled、custom 中任何类型
  只有不被依赖的自由字段值，才能放心的设置为 custom 为空值，由用户决定是否输入或者选择具体的值


配置项案例
------------------------------------------------------------------------------

const config = {
	usertype: {
	 master: true, // 初始化触发第一次响应（若页面没有任何初始响应规则执行，须依靠用户交互才能开始运行）
	 value: '1',
	 // 值类型规则（顶级）
	 rule: ['1', 'required']
	},
	nickname: {
	 // 子级依赖型规则
	 rule: {
	   usertype: {
		 1: 'hide',
		 2: 'custom',
		 3: 'required'
	   }
	 }
	},
	address: {
	 // handler 类型规则（顶层）
	 rule: {
	   watch: ['usertype'],
	   handler(value, model) {
		 if (model['usertype'] === '3') return ['', 'hide'];
		 return ['', 'required'];
	   }
	 }
	}
}

注意：
1、每个配置集合，都应该设计1个或者多个顶级被依赖规则，而这些顶级规则不依赖任何其它项目，具有独立的默认值 value，
且 master 为 true 来在页面加载完成后立即生效第一次配置，让页面规则开始联动起来。
2、rule: xxx 顶级规则只能是 string、string[]、handler、object（包含子规则）四种类型，函数类型配置不能做为顶级规则
3、位于中间层的规则，因为其做为后续规则的依赖项目，应该不论哪种情况都返回具体的值，来给予后续规则指引具体的取值分支

```
