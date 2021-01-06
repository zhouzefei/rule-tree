"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

require("antd/lib/icon/style");

var _icon = _interopRequireDefault(require("antd/lib/icon"));

require("antd/lib/button/style");

var _button = _interopRequireDefault(require("antd/lib/button"));

require("antd/lib/select/style");

var _select = _interopRequireDefault(require("antd/lib/select"));

var _react = _interopRequireWildcard(require("react"));

var _d3Hierarchy = require("d3-hierarchy");

var _reactDnd = require("react-dnd");

var _reactDndHtml5Backend = _interopRequireDefault(require("react-dnd-html5-backend"));

var _get = _interopRequireDefault(require("lodash/get"));

var _Drag = _interopRequireWildcard(require("./Drag"));

var _Drop = _interopRequireDefault(require("./Drop"));

var _Link = _interopRequireDefault(require("./Link"));

var _operators = _interopRequireDefault(require("./constants/operators"));

var _size = require("./constants/size");

require("./index.less");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Option = _select.default.Option;
var DndContext = (0, _reactDnd.createDndContext)(_reactDndHtml5Backend.default);
var dndType = "dndType-0";

var _default = function _default(props) {
  var _ref = props || [],
      _ref$relations = _ref.relations,
      relations = _ref$relations === void 0 ? [{
    name: "&&",
    dName: "与",
    enDName: "And"
  }, {
    name: "||",
    dName: "或",
    enDName: "Or"
  }] : _ref$relations,
      _ref$relationName = _ref.relationName,
      relationName = _ref$relationName === void 0 ? "logicOperator" : _ref$relationName,
      value = _ref.value,
      _onChange = _ref.onChange,
      fields = _ref.fields,
      nameKeys = _ref.nameKeys,
      _ref$canDrag = _ref.canDrag,
      canDrag = _ref$canDrag === void 0 ? true : _ref$canDrag,
      _ref$canRootChange = _ref.canRootChange,
      canRootChange = _ref$canRootChange === void 0 ? true : _ref$canRootChange; // key的默认值


  var keyDefault = (0, _react.useRef)(0); // 格式化节点树

  var addDropAreaAndOperation = function addDropAreaAndOperation(children, parentPath, canDrag, level) {
    if (!children) {
      children = [];
    }

    var result = [];

    if (children.length) {
      children.forEach(function (child, index) {
        var path = [].concat(parentPath, [index]);

        var _ref2 = child || {},
            key = _ref2.key;

        var node = Object.assign({}, child, {
          type: "leaf",
          key: key,
          index: index,
          parentPath: parentPath,
          path: path
        });

        if (child.children) {
          node.type = "relation";
          node.children = addDropAreaAndOperation(child.children, path.concat(['children']), canDrag, level + 1);
          path.push("relation");
        }

        result.push(node);
      });
    }

    if (canDrag) {
      result.push({
        index: children.length,
        type: "action",
        key: "action-" + parentPath.join("-"),
        parentPath: parentPath,
        level: level + 1
      });
    }

    return result;
  }; // 新增条件


  var handleAddCondition = function handleAddCondition(data) {
    var children = (0, _get.default)(value, data.parentPath);
    children.push({});
    _onChange && _onChange(_objectSpread({}, value));
  }; // 新增条件组


  var handleAddGroup = function handleAddGroup(data) {
    var children = (0, _get.default)(value, data.parentPath);
    children.push({
      children: [{}]
    });
    _onChange && _onChange(_objectSpread({}, value));
  }; // 删除事件


  var handleDelete = function handleDelete(data, node) {
    // 只剩下两个的场景，需要移除children上一层
    if (node.parent.children.length === 2) {
      handleDeleteSingleGroup(node);
    } else {
      var deleteParent = (0, _get.default)(value, data.parentPath);
      deleteParent.splice(data.index, 1);
      _onChange && _onChange(_objectSpread({}, value));
    }
  };

  var handleDeleteGroup = function handleDeleteGroup(node) {
    var tempValue = _objectSpread({}, value);

    var deleteParent = node.parent;
    var deleteGrandPa = deleteParent.parent;

    if (!deleteGrandPa) {
      // root
      tempValue.children = [];
    } else if (!deleteGrandPa.data.parentPath) {
      // grandpa是root
      tempValue.children.splice(deleteParent.data.index, 1);
    } else {
      var dp = (0, _get.default)(tempValue, deleteParent.data.parentPath);
      dp.splice(deleteParent.data.index, 1);
    }

    _onChange && _onChange(tempValue);
  };

  var handleDeleteSingleGroup = function handleDeleteSingleGroup(node) {
    if (!node.parent || !node.parent.children) {
      return;
    }

    if (node.parent.children.length === 2) {
      var parent = node.parent;
      handleDeleteGroup(node);
      handleDeleteSingleGroup(parent);
    }
  }; // 拖拽回调


  var handleDrop = function handleDrop(dropProps, dragProps) {
    var parent = (0, _get.default)(value, dragProps.data.parentPath);
    var dropParent = (0, _get.default)(value, dropProps.data.parentPath); // 删掉

    var dragItem = parent.splice(dragProps.data.index, 1)[0]; // 添加

    dropParent.splice(dropProps.data.index, 0, dragItem);
    _onChange && _onChange(_objectSpread({}, value));
  }; // 计算坐标定位


  var buildNodes = function buildNodes(root, canDrag) {
    var leafCount = 0,
        height = 0;
    var nodes = root.eachAfter(function (d) {
      d.y = d.depth * (_size.RELATION_WIDTH + _size.COMPONENT_SPACE_HORIZONTAL + (canDrag ? _size.COMPONENT_HEIGHT : 0));

      if (canDrag && d.depth > 0) {
        d.y -= _size.COMPONENT_SPACE_HORIZONTAL;
      }

      if (d.data.type !== "relation") {
        d.x = leafCount * (_size.COMPONENT_HEIGHT + _size.COMPONENT_SPACE_VERTICAL);
        leafCount += 1;
      } else {
        d.x = d.children && d.children.length ? (d.children[0].x + d.children[d.children.length - 1].x) / 2 : 0;

        if (!d.parent) {
          height = d.children[d.children.length - 1].x + _size.COMPONENT_HEIGHT;
        }
      }
    });
    return {
      nodes: nodes,
      height: height
    };
  }; // dom field渲染


  var createFields = function createFields(nodes, canDrag) {
    var result = [];
    var DragItem = canDrag ? _Drag.default : _Drag.UnDrag;
    nodes.forEach(function (node, nindex) {
      var data = node.data,
          x = node.x,
          y = node.y,
          parent = node.parent;

      var _ref3 = data || {},
          type = _ref3.type,
          index = _ref3.index,
          parentPath = _ref3.parentPath,
          key = _ref3.key; // 根节点


      if (!parent) {
        var style = {
          width: _size.RELATION_WIDTH,
          minWidth: _size.RELATION_WIDTH,
          position: 'absolute',
          left: y,
          top: x + _size.COMPONENT_MARGIN / 2
        };
        result.push( /*#__PURE__*/_react.default.createElement("div", {
          key: getHierarchyId(key, 'root')
        }, canRootChange ? /*#__PURE__*/_react.default.createElement(_select.default, {
          style: style,
          placeholder: "\u9009\u62E9",
          disabled: !canDrag,
          value: value[relationName] || undefined,
          onChange: function onChange(e) {
            _onChange && _onChange(_objectSpread(_objectSpread({}, value), {}, _defineProperty({}, relationName, e)));
          }
        }, relations && !!relations.length && relations.map(function (relation) {
          return /*#__PURE__*/_react.default.createElement(Option, {
            value: relation.name,
            key: relation.name
          }, relation.dName);
        })) : /*#__PURE__*/_react.default.createElement(_button.default, {
          style: style
        }, relations && !!relations.length && relations[0].dName)));
      } else {
        if (canDrag) {
          var dropX = index === 0 ? x - _size.COMPONENT_SPACE_VERTICAL : x - (x - (nodes[nindex - 1].x + _size.COMPONENT_HEIGHT) + _size.COMPONENT_SPACE_VERTICAL) / 2;

          var dropEle = /*#__PURE__*/_react.default.createElement(_Drop.default, {
            x: y,
            y: dropX,
            node: node,
            data: data,
            onDrop: handleDrop,
            canDrag: canDrag,
            type: dndType,
            key: getHierarchyId(key, 'drop')
          });

          result.push(dropEle);
        }

        ;
        var ele = null;

        if (type === "relation") {
          ele = /*#__PURE__*/_react.default.createElement(DragItem, {
            x: y,
            y: x,
            node: node,
            data: data,
            type: dndType,
            key: getHierarchyId(key, 'relation')
          }, /*#__PURE__*/_react.default.createElement(_select.default, {
            style: {
              width: _size.RELATION_WIDTH,
              minWidth: _size.RELATION_WIDTH
            },
            placeholder: "\u9009\u62E9",
            disabled: !canDrag,
            value: (0, _get.default)(value, parentPath)[index][relationName] || undefined,
            onChange: function onChange(e) {
              var valueTemp = _objectSpread({}, value);

              (0, _get.default)(valueTemp, parentPath)[index][relationName] = e;
              _onChange && _onChange(valueTemp);
            }
          }, relations && !!relations.length && relations.map(function (relation) {
            return /*#__PURE__*/_react.default.createElement(Option, {
              value: relation.name,
              key: relation.name
            }, relation.dName);
          })));
        } else if (type === "leaf") {
          ele = /*#__PURE__*/_react.default.createElement(DragItem, {
            x: y,
            y: x,
            node: node,
            data: data,
            type: dndType,
            key: getHierarchyId(key, 'leaf')
          }, /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, fields(data).map(function (field, i) {
            var _field$props = field.props,
                fieldChange = _field$props.onChange,
                style = _field$props.style,
                name = _field$props.name;
            var valueTemp = JSON.parse(JSON.stringify(value));
            var curValue = (0, _get.default)(valueTemp, parentPath)[index];

            var _ref4 = nameKeys || {},
                _ref4$property = _ref4.property,
                propertyName = _ref4$property === void 0 ? "property" : _ref4$property,
                _ref4$propertyDataTyp = _ref4.propertyDataType,
                propertyDataTypeName = _ref4$propertyDataTyp === void 0 ? "propertyDataType" : _ref4$propertyDataTyp,
                _ref4$operator = _ref4.operator,
                operatorKeyName = _ref4$operator === void 0 ? "operator" : _ref4$operator,
                _ref4$type = _ref4.type,
                typeKeyName = _ref4$type === void 0 ? "type" : _ref4$type,
                _ref4$value = _ref4.value,
                valueName = _ref4$value === void 0 ? "value" : _ref4$value,
                _ref4$enumValue = _ref4.enumValue,
                enumValueName = _ref4$enumValue === void 0 ? "enumValue" : _ref4$enumValue; // 对数据进行联动过滤


            var children = {};

            if (name === operatorKeyName) {
              // 将操作符根据字段类型过滤
              children = {
                children: (0, _operators.default)(curValue[propertyDataTypeName]).map(function (v) {
                  return /*#__PURE__*/_react.default.createElement(Option, {
                    value: v.name,
                    key: v.name
                  }, v.dName);
                })
              };
            }

            ; // 字段类型为枚举时

            if (curValue[propertyDataTypeName] === "ENUM") {
              // 选择变量常量选项不展示
              if ([typeKeyName, valueName].includes(name)) {
                return null;
              }
            } else {
              // 选择变量时
              if (curValue[typeKeyName] && curValue[typeKeyName] === "context") {
                if ([valueName].includes(name)) {
                  return null;
                }
              } else {
                // 选择常量时
                if ([enumValueName].includes(name)) {
                  return null;
                }
              }
            } // 操作符为 为空、不为空


            if (["isnull", "notnull"].includes(curValue[operatorKeyName])) {
              if ([typeKeyName, valueName, enumValueName].includes(name)) {
                return null;
              }
            }

            return /*#__PURE__*/_react.default.cloneElement(field, _objectSpread(_objectSpread({
              key: i,
              value: curValue[name] || undefined,
              onChange: function onChange(e, _this) {
                // 触发自定义事件
                fieldChange && fieldChange(e, _this, parentPath, index); // 当变更第一列字段例如系统字段时，清空其他数据源

                if (i === 0) {
                  Object.keys(curValue).forEach(function (v) {
                    return curValue[v] = "";
                  });
                }

                ; // 设置当前值

                curValue[name] = e.target ? e.target.value : e; // 设置字段类型

                if (name === propertyName) {
                  curValue[propertyDataTypeName] = _this.props.type;
                }

                ;

                if (name === operatorKeyName && ["isnull", "notnull"].includes(e)) {
                  curValue[typeKeyName] = "";
                  curValue[valueName] = "";
                }

                _onChange && _onChange(valueTemp);
              }
            }, children), {}, {
              disabled: !canDrag,
              style: _objectSpread({
                "width": "160px",
                "marginLeft": nindex ? _size.COMPONENT_MARGIN : 0
              }, style)
            }));
          })), canDrag && /*#__PURE__*/_react.default.createElement(_icon.default, {
            type: "delete",
            style: {
              marginLeft: _size.COMPONENT_MARGIN,
              cursor: 'pointer'
            },
            onClick: function onClick() {
              handleDelete(data, node);
            }
          }));
        } else {
          if (canDrag) {
            ele = /*#__PURE__*/_react.default.createElement("div", {
              className: "plus-wrap",
              style: {
                "top": x,
                "left": y
              },
              key: getHierarchyId(key, 'action'),
              "data-key": getHierarchyId(key, 'action')
            }, /*#__PURE__*/_react.default.createElement(_icon.default, {
              type: "plus",
              onClick: function onClick() {
                handleAddCondition(data);
              }
            }), /*#__PURE__*/_react.default.createElement(_icon.default, {
              type: "plus-square",
              onClick: function onClick() {
                handleAddGroup(data);
              }
            }));
          }
        }

        result.push(ele);
      }
    });
    return result;
  }; // 获取id


  var getHierarchyId = function getHierarchyId() {
    for (var _len = arguments.length, ids = new Array(_len), _key = 0; _key < _len; _key++) {
      ids[_key] = _key < 0 || arguments.length <= _key ? undefined : arguments[_key];
    }

    return ids.join('.');
  }; // 设置唯一性


  var getUniqKey = function getUniqKey(key, keyMap) {
    if (key in keyMap) {
      var k = key + 1;
      return getUniqKey(k, keyMap);
    }

    return key;
  }; // 设置key


  var setKey = function setKey(data, keyMap) {
    var createKey = function createKey(v) {
      if (!(v && v.key)) {
        v.key = getUniqKey(keyDefault.current, keyMap);
      }

      keyMap[v.key] = 1;

      if (v && v.children && v.children.length) {
        setKey(v.children, keyMap);
      }
    };

    if (Array.isArray(data)) {
      data.forEach(function (v, i) {
        v.index = i;
        createKey(v);
      });
    } else {
      if (data) {
        data.index = 0;
        createKey(data);
      }
    }
  }; // 设置key


  var valueTemp = JSON.parse(JSON.stringify(value));
  var finalValue = Object.assign({
    type: "relation",
    path: ['relation']
  }, setKey(valueTemp, {}));
  finalValue.children = addDropAreaAndOperation(valueTemp.children, ['children'], canDrag, 0);
  var hierarchyData = (0, _d3Hierarchy.hierarchy)(finalValue);

  var _buildNodes = buildNodes(hierarchyData, canDrag),
      nodes = _buildNodes.nodes,
      height = _buildNodes.height;

  var flattenNodes = nodes.descendants();
  var flattenLinks = nodes.links();
  return /*#__PURE__*/_react.default.createElement(_reactDnd.DndProvider, {
    manager: DndContext.dragDropManager
  }, /*#__PURE__*/_react.default.createElement("div", {
    className: "tntx-rule-tree-content",
    style: {
      "position": "relative",
      "height": height + "px"
    }
  }, createFields(flattenNodes, canDrag), flattenLinks.map(function (link, linkIndex) {
    var source = link.source,
        target = link.target;
    var sourceKey = source.data.key;
    var targetKey = target.data.key;
    var x;

    if (!source.parent) {
      x = source.y + _size.RELATION_WIDTH;
    } else {
      x = source.y + _size.RELATION_WIDTH + (canDrag ? _size.COMPONENT_SPACE_HORIZONTAL : 0);
    }

    ;
    return /*#__PURE__*/_react.default.createElement("div", {
      key: getHierarchyId(sourceKey, targetKey),
      "data-key": getHierarchyId(sourceKey, targetKey)
    }, /*#__PURE__*/_react.default.createElement(_Link.default, {
      source: {
        x: x,
        y: source.x
      },
      target: {
        x: target.y,
        y: target.x
      }
    }));
  })));
};

exports.default = _default;