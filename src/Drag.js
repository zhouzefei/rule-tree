import React from 'react';
import { DragSource } from 'react-dnd';


const ALIGN_CENTER = {
    height: 40,
    lineHeight: '39px'
};
const handleStyle = {
  cursor: 'move',
  marginRight: 2,
  ...ALIGN_CENTER
};

const Drag = (_ref) => {
  const { isDragging, connectDragSource, connectDragPreview, x, y, children } = _ref;
  const opacity = isDragging ? 0.4 : 1;
  return connectDragPreview(
    <div
        className="drag"
        style={{
            opacity: opacity,
            left: x,
            top: y,
            position:"absolute"
        }}
    >
        {
            connectDragSource(
                <span
                    className="drag-icon"
                    custom="true"
                    type="tuodong"
                    style={handleStyle}
                >
                </span>
            )
        }
        <span
            style={{
                display: 'flex',
                alignItems: "center",
                ...ALIGN_CENTER
            }}
        >
            {children}
        </span>
    </div>
  )
};

export default DragSource((_ref2) => {
  var type = _ref2.type;
  return type;
}, {
  beginDrag: (props) => {
    console.log("bigin")
    return props;
  },
  endDrag: (props) => {
    console.log("end")
    return props;
  }
}, (connect, monitor) => {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  };
})(Drag);


export const UnDrag = (_ref3) => {
    const {children, x, y } = _ref3;
    return (
        <div
        style={{
            position: 'absolute',
            left: x,
            top: y,
            display: 'flex',
            alignItems: "center",
            ...ALIGN_CENTER
        }}>
            {children}
        </div>
    );
};
