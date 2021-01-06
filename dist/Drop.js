"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactDnd = require("react-dnd");

var _Link = _interopRequireDefault(require("./Link"));

var _size = require("./constants/size");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var innerStyle = {
  width: _size.RELATION_WIDTH,
  height: _size.COMPONENT_SPACE_VERTICAL
};

var Drop = function Drop(_ref) {
  var canDrop = _ref.canDrop,
      isOver = _ref.isOver,
      connectDropTarget = _ref.connectDropTarget,
      x = _ref.x,
      y = _ref.y,
      canDrag = _ref.canDrag,
      node = _ref.node;
  var clsNames = (canDrop ? 'drop-area' : '') + " " + (canDrop && isOver ? 'drop-area-can-drop' : '');
  var parent = node.parent;
  var x0;

  if (!parent.parent) {
    x0 = parent.y + _size.RELATION_WIDTH;
  } else {
    x0 = parent.y + _size.RELATION_WIDTH + (canDrag ? _size.COMPONENT_SPACE_HORIZONTAL : 0);
  }

  return /*#__PURE__*/_react.default.createElement(_react.default.Fragment, null, /*#__PURE__*/_react.default.createElement("div", {
    ref: connectDropTarget,
    className: clsNames,
    style: _objectSpread(_objectSpread({}, innerStyle), {}, {
      position: 'absolute',
      left: x,
      top: y
    })
  }), canDrop && /*#__PURE__*/_react.default.createElement(_Link.default, {
    highlight: true,
    source: {
      x: x0,
      y: parent.x
    },
    target: {
      x: x,
      y: y + _size.COMPONENT_SPACE_VERTICAL / 2 - _size.COMPONENT_HEIGHT / 2
    }
  }));
};

var _default = (0, _reactDnd.DropTarget)(function (_ref2) {
  var type = _ref2.type;
  return type;
}, {
  canDrop: function canDrop(drop, monitor) {
    var drag = monitor.getItem(); // 根节点不能放到子树中

    var depthDiff = drop.node.depth - drag.node.depth;

    if (depthDiff > 0) {
      var p = drop.node;

      while (depthDiff--) {
        p = p.parent;
      }

      if (p === drag.node) {
        return false;
      }
    }

    var cannot = drag.data.parentPath === drop.data.parentPath && (drag.data.index === drop.data.index || drag.data.index + 1 === drop.data.index);
    return !cannot;
  },
  drop: function drop(props, monitor) {
    var item = monitor.getItem();
    props.onDrop(props, item);
    return props;
  }
}, function (connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop()
  };
})(Drop);

exports.default = _default;