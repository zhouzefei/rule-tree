"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _size = require("./constants/size");

var _default = function _default(props) {
  var source = props.source,
      target = props.target;

  var drawLine = function drawLine(x1, y1, x2, y2) {
    var isH = isHorizontal(x1, x2);
    var width = isH ? x2 - x1 : Math.abs(y1 - y2);
    var highlight = props.highlight;
    var style = {
      height: isH ? 1 : width,
      width: isH ? width : 1,
      left: x1,
      top: (isH ? y1 : Math.min(y1, y2)) + _size.COMPONENT_HEIGHT / 2,
      zIndex: highlight ? 1 : 0
    };
    var clsNames = "link " + (highlight ? ['link-highlight'] : '');
    return /*#__PURE__*/React.createElement("div", {
      className: clsNames,
      style: style,
      "data-key": genKey([x1, y1, x2, y2]),
      key: genKey([x1, y1, x2, y2])
    });
  };

  var isHorizontal = function isHorizontal(x1, x2) {
    if (x1 === x2) {
      return false;
    }

    return true;
  };

  var genKey = function genKey(value) {
    if (value === void 0) {
      value = [];
    }

    var _value = value,
        x1 = _value[0],
        y1 = _value[1],
        x2 = _value[2],
        y2 = _value[3];
    return "," + x1 + "," + y1 + "-" + x2 + "," + y2;
  };

  var x1 = source.x,
      y1 = source.y;
  var x2 = target.x,
      y2 = target.y;
  var lines = [];

  if (x1 === x2 || y1 === y2) {
    // 一条直线
    lines = [drawLine(x1, y1, x2, y2)];
  } else {
    // 一条折线，找到转折点，左(x1,y1) -> 右(x2,y2)
    var xm = (x1 + x2) / 2;
    var ym = y1;
    var xn = xm;
    var yn = y2;
    lines.push(drawLine(x1, y1, xm, ym));
    lines.push(drawLine(xm, ym, xn, yn));
    lines.push(drawLine(xn, yn, x2, y2));
  }

  return /*#__PURE__*/React.createElement(React.Fragment, null, lines);
};

exports.default = _default;