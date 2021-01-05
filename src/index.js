import { useRef, useState } from "react";
import { Select, Input, Icon, Button } from "antd";
import { hierarchy } from 'd3-hierarchy';
import { DndProvider, createDndContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import get from 'lodash/get';
import Drag, { UnDrag } from './Drag';
import Drop from './Drop';
import Link from "./Link";
import "./index.less";
import { RELATION_WIDTH, COMPONENT_HEIGHT, COMPONENT_SPACE_VERTICAL, COMPONENT_SPACE_HORIZONTAL, COMPONENT_MARGIN } from "./constants";

const { Option } = Select;
const canDrag = true;
const canRootChange = true;

const DndContext = createDndContext(HTML5Backend);
const dndType = "dndType-0";

export default () => {
    // key的默认值
    const keyDefault = useRef(0);

    // 格式化节点树
    const addDropAreaAndOperation = (children, parentPath, canDrag, level) => {
        if(!children){
            children = [];
        }
        let result = [];
        if(children.length){
            children.forEach((child,index)=>{
                const path = [].concat(parentPath,[index]);
                const { key } = child || {};
                const node = Object.assign({},child,{
                    type:"leaf",
                    key,
                    index,
                    parentPath,
                    path
                });
                if(child.children){
                    node.type = "relation";
                    node.children = addDropAreaAndOperation(child.children, path.concat(['children']), canDrag, level+1)
                    path.push("relation")
                }
                result.push(node);
            });
        }
        if(canDrag){
            result.push({
                index:children.length,
                type:"action",
                key:"action-"+parentPath.join("-"),
                parentPath,
                level:level+1
            })
        }
        return result;
    };

    // 新增条件
    const handleAddCondition = (data) => {
        const children = get(value, data.parentPath);
        children.push({});
        setValue({...value})
    };

    // 新增条件组
    const handleAddGroup = (data) => {
        const children = get(value, data.parentPath);
        children.push({
            children: [{}]
        });
        setValue({...value})
    };

    // 删除事件
    const handleDelete = (data,node) => {
        // 只剩下两个的场景，需要移除children上一层
        if(node.parent.children.length === 2){
            handleDeleteSingleGroup(node);
        }else{
            const deleteParent = get(value, data.parentPath);
            deleteParent.splice(data.index, 1);
            setValue({...value});
        }
    };
    const handleDeleteGroup = (node) => {
        const tempValue = {...value};
        const deleteParent = node.parent;
        const deleteGrandPa = deleteParent.parent;
        if (!deleteGrandPa) {
          // root
          tempValue.children = [];
        } else if (!deleteGrandPa.data.parentPath) {
          // grandpa是root
          tempValue.children.splice(deleteParent.data.index, 1);
        } else {
          var dp = get(tempValue, deleteParent.data.parentPath);
          dp.splice(deleteParent.data.index, 1);
        }
        setValue(tempValue);
    };
    const handleDeleteSingleGroup = (node) => {
        if (!node.parent || !node.parent.children) {
            return;
        }
        if (node.parent.children.length === 2) {
            const parent = node.parent;
            handleDeleteGroup(node);
            handleDeleteSingleGroup(parent);
        }
    };

    // 拖拽回调
    const handleDrop = (dropProps, dragProps) => {
        const parent = get(value, dragProps.data.parentPath);
        const dropParent = get(value, dropProps.data.parentPath); // 删掉
        const dragItem = parent.splice(dragProps.data.index, 1)[0]; // 添加
        dropParent.splice(dropProps.data.index, 0, dragItem);
        setValue({...value})
    };

    // 计算坐标定位
    const buildNodes = (root, canDrag) => {
        let [leafCount, height] = [0, 0];
        const nodes = root.eachAfter(function (d) {
            d.y = d.depth * (RELATION_WIDTH + COMPONENT_SPACE_HORIZONTAL + (canDrag ? COMPONENT_HEIGHT : 0));
            if (canDrag && d.depth > 0) {
                d.y -= COMPONENT_SPACE_HORIZONTAL;
            }
            if (d.data.type !== "relation") {
                d.x = leafCount * (COMPONENT_HEIGHT + COMPONENT_SPACE_VERTICAL);
                leafCount += 1;
            } else {
                d.x = d.children && d.children.length ? (d.children[0].x + d.children[d.children.length - 1].x) / 2 : 0;
                if (!d.parent) {
                    height = d.children[d.children.length - 1].x + COMPONENT_HEIGHT;
                }
            }
        });
        return {
          nodes: nodes,
          height: height
        };
    };

    // dom field渲染
    const createFields = (nodes, canDrag) => {
        const result = [];
        const DragItem = canDrag ? Drag : UnDrag;
        nodes.forEach((node, nindex)=>{
            const { data, x, y, parent } = node;
            const { type, index, path, key } = data || {};
            // 根节点
            if(!parent){
                const style = {
                    width: RELATION_WIDTH,
                    minWidth: RELATION_WIDTH,
                    position: 'absolute',
                    left: y,
                    top: x + COMPONENT_MARGIN / 2
                };
                result.push(
                    <div key={getHierarchyId(key,'root')}>
                        {
                            canRootChange ?
                            <Select
                                style={style}
                                value="&"
                                placeholder="请选择"
                                disabled={!canDrag}
                            >
                                <Option value="&">与</Option>
                            </Select> :
                            <Button
                                style={style}
                            >
                                与
                            </Button>
                        }
                    </div>
                )
            }else{
                if (canDrag) {
                    const dropX = (
                        index === 0 ?
                        x - COMPONENT_SPACE_VERTICAL :
                        x - (x - (nodes[nindex - 1].x + COMPONENT_HEIGHT) + COMPONENT_SPACE_VERTICAL) / 2
                    );
                    const dropEle = (
                        <Drop
                            x={y}
                            y={dropX}
                            node={node}
                            data={data}
                            onDrop={handleDrop}
                            canDrag={canDrag}
                            type={dndType}
                            key={getHierarchyId(key, 'drop')}
                        >
                        </Drop>
                    );
                    result.push(dropEle);
                };
                let ele = null;
                if(type === "relation"){
                    ele = (
                        <DragItem
                            x={y}
                            y={x}
                            node={node}
                            data={data}
                            type={dndType}
                            key={getHierarchyId(key, 'relation')}
                        >
                             <Select
                                style={{
                                    width: RELATION_WIDTH,
                                    minWidth: RELATION_WIDTH
                                }}
                                value="&"
                                placeholder="请选择"
                                disabled={!canDrag}
                            >
                                <Option value="&">与</Option>
                            </Select>
                        </DragItem>
                    )
                }else if(type === "leaf"){
                    ele = (
                        <DragItem
                            x={y}
                            y={x}
                            node={node}
                            data={data}
                            type={dndType}
                            key={getHierarchyId(key, 'leaf')}
                        >
                            <>
                                <Select
                                    placeholder="请选择"
                                    style={{
                                        "width":"160px",
                                        marginLeft: nindex ? COMPONENT_MARGIN : 0
                                    }}
                                >
                                    <Option value="system">系统字段</Option>
                                </Select>
                                <Select
                                    placeholder="请选择"
                                    style={{
                                        "width":"160px",
                                        marginLeft: nindex ? COMPONENT_MARGIN : 0
                                    }}
                                >
                                    <Option value=">">大于</Option>
                                </Select>
                                <Input
                                    placeholder="请输入数量"
                                    style={{
                                        "width":"160px",
                                        marginLeft: nindex ? COMPONENT_MARGIN : 0
                                    }}
                                />
                            </>
                            {
                                canDrag &&
                                <Icon
                                    type="delete"
                                    style={{
                                        marginLeft: COMPONENT_MARGIN,
                                        cursor: 'pointer',
                                    }}
                                    onClick={()=>{
                                        handleDelete(data,node)
                                    }}
                                />
                            }
                        </DragItem>
                    )
                }else{
                    ele = (
                        <div
                            className="plus-wrap"
                            style={{"top":x, "left":y}}
                            key={getHierarchyId(key, 'action')}
                            data-key={getHierarchyId(key, 'action')}
                        >
                            <Icon
                                type="plus"
                                onClick={()=>{
                                    handleAddCondition(data);
                                }}
                            />
                            <Icon
                                type="plus-square"
                                onClick={()=>{
                                    handleAddGroup(data);
                                }}
                            />
                        </div>
                    )
                }
                result.push(ele);
            }
        });
        return result;
    };

    // 获取id
    const getHierarchyId = (...args) => {
        for (var _len = args.length, ids = new Array(_len), _key = 0; _key < _len; _key++) {
          ids[_key] = args[_key];
        }
        return ids.join('.');
    };

    // 设置唯一性
    const getUniqKey = (key, keyMap) => {
        if(key in keyMap){
            const k = key + 1;
            return getUniqKey(k,keyMap);
        }
        return key;
    };

    // 设置key
    const setKey = (data, keyMap) => {
        const createKey = (v) => {
            if(!(v && v.key)){
                v.key = getUniqKey(keyDefault.current, keyMap)
            }
            keyMap[v.key] = 1;
            if(v && v.children && v.children.length){
                setKey(v.children, keyMap);
            }
        };
        if(Array.isArray(data)){
            data.forEach((v,i)=>{
                v.index = i;
                createKey(v);
            });
        }else{
            if(data){
                data.index = 0;
                createKey(data);
            }
        }
    };


    // 基础数据格式
    const [ value, setValue ] = useState({children: [{}]});

    // 设置key
    const valueTemp = {...value};
    setKey(valueTemp, {});
    const finalValue = Object.assign({
        type:"relation",
        path:['relation'],
    },valueTemp);
    finalValue.children = addDropAreaAndOperation(valueTemp.children, ['children'], canDrag, 0)

    console.log("finalValue",finalValue)

    const hierarchyData = hierarchy(finalValue);
    const { nodes, height } = buildNodes(hierarchyData,canDrag);
    var flattenNodes = nodes.descendants();
    var flattenLinks = nodes.links();

    return (
        <DndProvider
            manager={DndContext.dragDropManager}
        >
            <div className="rule-tree-content" style={{"position":"relative","height":height+"px"}}>
                { createFields(flattenNodes, canDrag) }
                {
                    flattenLinks.map((link,linkIndex)=>{
                        const { source,target } = link;
                        const sourceKey = source.data.key;
                        const targetKey = target.data.key;
                        var x;

                        if (!source.parent) {
                            x = source.y + RELATION_WIDTH;
                        } else {
                            x = source.y + RELATION_WIDTH + (canDrag ? COMPONENT_SPACE_HORIZONTAL : 0);
                        };
                        return (
                            <div
                                key={getHierarchyId(sourceKey,targetKey)}
                                data-key={getHierarchyId(sourceKey,targetKey)}
                            >
                                <Link
                                    source={{
                                        x: x,
                                        y: source.x
                                    }}
                                    target={{
                                        x: target.y,
                                        y: target.x
                                    }}
                                />
                            </div>
                        )
                    })
                }
            </div>
        </DndProvider>
    )
}
