import React from 'react';
import { DropTarget } from 'react-dnd';
import Link from './Link';
import { RELATION_WIDTH, COMPONENT_HEIGHT, COMPONENT_SPACE_VERTICAL, COMPONENT_SPACE_HORIZONTAL } from "./constants/size";

const innerStyle = {
  width: RELATION_WIDTH,
  height: COMPONENT_SPACE_VERTICAL
};

const Drop = (_ref) => {
  const { canDrop, isOver, connectDropTarget, x, y, canDrag, node  }  = _ref;
  const clsNames = (canDrop ? 'drop-area' : '') + " " + (canDrop && isOver ? 'drop-area-can-drop' : '');
  const { parent } = node;
  let x0;
  if (!parent.parent) {
    x0 = parent.y + RELATION_WIDTH;
  } else {
    x0 = parent.y + RELATION_WIDTH + (canDrag ? COMPONENT_SPACE_HORIZONTAL : 0);
  }
  return (
      <>
        <div
            ref={connectDropTarget}
            className={clsNames}
            style={{
                ...innerStyle,
                position: 'absolute',
                left: x,
                top: y
            }}
        >
        </div>
        {
            canDrop &&
            <Link
                highlight={true}
                source= {{
                    x: x0,
                    y: parent.x
                }}
                target= {{
                    x: x,
                    y: y + COMPONENT_SPACE_VERTICAL / 2 - COMPONENT_HEIGHT / 2
                }}
            />
        }
      </>
  );
};

@DropTarget(
    "box",
    {
    canDrop: (drop, monitor) => {
        const drag = monitor.getItem(); // 根节点不能放到子树中
        let depthDiff = drop.node.depth - drag.node.depth;

        if (depthDiff > 0) {
        var p = drop.node;

        while (depthDiff--) {
            p = p.parent;
        }

        if (p === drag.node) {
            return false;
        }
        }

        var cannot = (
            drag.data.parentPath === drop.data.parentPath &&
            (
                drag.data.index === drop.data.index ||
                drag.data.index + 1 === drop.data.index
            )
        );
        return !cannot;
    },
    drop: function drop(props, monitor) {
        var item = monitor.getItem();
        props.onDrop(props, item);
        return props;
    }
    },
    (connect, monitor) => {
        return {
            connectDropTarget: connect.dropTarget(),
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop()
        };
    }
)
export default class extends React.PureComponent{
    render(){
        return (
            <Drop {...this.props}/>
        )
    }
}


