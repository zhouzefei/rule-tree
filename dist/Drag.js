"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UnDrag = exports.default = void 0;

var _react = _interopRequireDefault(require("react"));

var _reactDnd = require("react-dnd");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var ALIGN_CENTER = {
  height: 40,
  lineHeight: '39px'
};

var handleStyle = _objectSpread({
  cursor: 'move',
  marginRight: 2
}, ALIGN_CENTER);

var Drag = function Drag(_ref) {
  var isDragging = _ref.isDragging,
      connectDragSource = _ref.connectDragSource,
      connectDragPreview = _ref.connectDragPreview,
      x = _ref.x,
      y = _ref.y,
      children = _ref.children;
  var opacity = isDragging ? 0.4 : 1;
  return connectDragPreview( /*#__PURE__*/_react.default.createElement("div", {
    className: "drag",
    style: {
      opacity: opacity,
      left: x,
      top: y,
      position: "absolute"
    }
  }, connectDragSource( /*#__PURE__*/_react.default.createElement("span", {
    className: "drag-icon",
    custom: "true",
    type: "tuodong",
    style: handleStyle
  })), /*#__PURE__*/_react.default.createElement("span", {
    style: _objectSpread({
      display: 'flex',
      alignItems: "center"
    }, ALIGN_CENTER)
  }, children)));
};

var _default = (0, _reactDnd.DragSource)(function (_ref2) {
  var type = _ref2.type;
  return type;
}, {
  beginDrag: function beginDrag(props) {
    console.log("bigin");
    return props;
  },
  endDrag: function endDrag(props) {
    console.log("end");
    return props;
  }
}, function (connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  };
})(Drag);

exports.default = _default;

var UnDrag = function UnDrag(_ref3) {
  var children = _ref3.children,
      x = _ref3.x,
      y = _ref3.y,
      data = _ref3.data;
  console.log(_ref3);
  return /*#__PURE__*/_react.default.createElement("div", {
    className: data.type !== "relation" ? "condition" : "",
    style: _objectSpread({
      position: 'absolute',
      left: x,
      top: y,
      display: 'flex',
      alignItems: "center"
    }, ALIGN_CENTER)
  }, children);
};

exports.UnDrag = UnDrag;