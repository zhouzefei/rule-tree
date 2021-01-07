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

@DragSource(
    "box",
    {
    beginDrag: (props) => {
        console.log("bigin")
        return props;
    },
    endDrag: (props) => {
        console.log("end")
        return props;
    }
    },
    (connect, monitor) => {
        return {
            connectDragSource: connect.dragSource(),
            connectDragPreview: connect.dragPreview(),
            isDragging: monitor.isDragging()
        };
    }
)
export default class extends React.PureComponent{
    render(){
        return <Drag {...this.props}/>
    }
};

export const UnDrag = (_ref3) => {
    const {children, x, y, data } = _ref3;
    console.log(_ref3)
    return (
        <div
            className={data.type !== "relation" ? "condition" : ""}
            style={{
                position: 'absolute',
                left: x,
                top: y,
                display: 'flex',
                alignItems: "center",
                ...ALIGN_CENTER
            }}
        >
            {children}
        </div>
    );
};
