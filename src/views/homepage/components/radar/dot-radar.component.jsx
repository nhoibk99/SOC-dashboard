import React, {useState} from 'react';
import {Tooltip} from 'reactstrap';

function getTopLeft(x, y, r) {
  let top = r;
  let left = r;
  if (x < 0) {
    left = r + r * x;
    // console.log(left);
  } else {
    left = r + r * x;
  }
  if (y < 0) {
    top = r - r * y;
  } else {
    top = r - r * y;
  }
  return [`${left}px`, `${top}px`];
}

const DotRadar = ({dotData, r}) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggle = () => setTooltipOpen(!tooltipOpen);
  const {x, y, label, id, color} = dotData;
  const [left, top] = getTopLeft(x, y, r);
  const nodeType = label.split('.')[1].split(' ')[0];
  {console.log('nodeType',nodeType)}
  return (
    <div className={nodeType == 'critical' ? "border-dot-critical" :"border-dot"} style={{left, top}}>
      <div className="dot-radar" style={{left, top, backgroundColor: color}} id={'Tooltip-' + id}>
        <Tooltip
          placement="top"
          isOpen={tooltipOpen}
          target={'Tooltip-' + id}
          toggle={toggle}
          >
          {label}
        </Tooltip>
      </div>
    </div>
  );
};

export default DotRadar;
