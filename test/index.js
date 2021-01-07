import ReactDOM from "react-dom";
import { useState } from "react";
import { Select, Input } from "antd";
import RuleTree from "../src";
import "./index.less";

const { Option } = Select;
const fieldList = [{
    dName: "最近7天交易账号交易笔数",
    name: "salaxyzb_a942bfb7a7dd4f0da355118a7ac6ae09",
    type: "DOUBLE"
},{
    dName: "测试测试测试测试",
    name: "salaxyzb_6cdc895fa67b4286ac102ca471bf6b99",
    type: "STRING"
},{
    dName: "是否境外",
    name: "S_E_ISABROAD",
    type: "ENUM"
}];

// nameKeys={{
//     "property":"property",
//     "propertyDataType":"propertyDataType",
//     "operator":"operator",
//     "type":"type",
//     "value":"value",
//     "enumValue":"enumValue"
// }}
const RuleTreeDemo = () => {
    const [value,setValue] = useState({
        logicOperator: "||",
        children: [{},{},{},{
            children:[{}]
        }]
    });

    const onChange = (data) => {
        setValue({...data})
    };

    return (
        <RuleTree
            relationName="logicOperator"
            value={value}
            onChange={onChange}
            fields={()=>{
                return (
                    [
                        // 此select建议使用高性能select组件
                        <Select
                            name="property" // 字段key
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
            canDrag={true}
        />
    )
}

ReactDOM.render(<RuleTreeDemo />, document.getElementById("app"));
