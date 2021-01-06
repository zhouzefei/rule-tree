### 规则树
默认内置：
1. 数据类型与操作符联动
2. 字段为枚举场景
3. 操作符为空不为空与后续操作的联动
4. 变更字段重置当前行其他数据
##### 通用数据结构
```javascript
    {
        logicOperator:"&&",
        children:[{
            "property":"xxx",
            "propertyDataType":"String",
            "operator":">=",
            "type":"context",
            "value":"1",
        },{
            logicOperator:"&&",
            children:[{
                "property":"xxx1",
                "propertyDataType":"DOUBLE",
                "operator":"==",
                "type":"input",
                "value":"3333",
            }]
        }]
    }
```
##### API
##### 1.组件 API
|参数|数据类型|默认值|作用|备注|
|  ----  |  ----  | ----  |  ----  | ----|
| canDrag | Boolean | true | 是否支持拖拽 | disabled模式设置false即可，将取消增删拖拽功能 |
| nameKeys | Map | null | 数据结构不符合上述结构进行映射 | 结构一致无需设置 |
| value | Map | `{ logicOperator: "||", children: [] }`  | 组件的值 | 需初始值|
| onChange | Function | `(value)=>{}` | 组件变更事件 ||
| fields | Function | `(colValue)=>{}` | 条件组展示的Dom | colValue为每一条件组返回的值，可以自定义联动 |

##### 2.fields API
|参数|数据类型|作用|
|  ----  |  ----  | ----  | 
| name | String | 表单名称 | 

<br/>

##### 案例

```javascript
    <RuleTree
        canDrag={true}
        relationName="logicOperator"
        value={value}
        onChange={onChange}
        fields={(colValue)=>{
            return (
                [
                    <Select
                        name="property" 
                        placeholder="字段"
                    >
                        {
                            fieldList.map(data=>{
                                return (
                                    <Option key={data.name} type={data.type} value={data.name}>{data.dName}</Option>
                                )
                            })
                        }
                    </Select>,
                    <Select
                        name="operator"
                        placeholder="操作符"
                    />,
                    <Select
                        name="type"
                        placeholder="类型"
                        style={{"width":"100px"}}
                    >
                        <Option value="input">常量</Option>
                        <Option value="context">变量</Option>
                    </Select>,
                    <Input
                        name="value"
                        placeholder="请输入数量"
                    />,
                    <Select
                        name="enumValue"
                        placeholder="枚举类型"
                    >
                        <Option value="lower">较低风险</Option>
                        <Option value="low">低风险</Option>
                        <Option value="high">高风险</Option>
                        <Option value="higher">较高风险</Option>
                    </Select>
                ]
            )
        }}
    />  
```
