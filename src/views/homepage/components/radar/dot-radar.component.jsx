import React, {useState} from 'react';
// import {Tooltip} from 'reactstrap';
// import ReactTooltip from 'react-tooltip';
// import Tooltip from '../../../../Tooltip';
import Tooltip from '@material-ui/core/Tooltip';
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
  const TooltipStyle = {
    backgroundColor:'#FFF',
    color: "black",
    borderStyle: "solid",
    borderWidth: "10px",
    borderColor: "blue",
  };
  // {console.log('nodeType',nodeType)}
  return (
    <div className="dot-radar" style={{left, top, backgroundColor: color}} >
        {/* <Tooltip position="top" isOpen={true} content= {label} animationDuration={2000}> */}
        <Tooltip arrow  title={label} >
        <div className={nodeType == 'critical' ? "border-dot-critical" :"border-dot"} id={'Tooltip-' + id}>
        {/* <Tooltip
          id="tooltipDot"  
          className="tooltipDot"
          // arrowClassName="arrowDot"
          // style={{
          //     "backgroundColor":'#FFF',
          //     "color": "black",
          //     "borderStyle": "solid",
          //     "borderWidth": "10px",
          //     "borderColor": "red",
          //     // "top": "10px",
          //     // ".arrowDot{ border-color": "#FFF}"
          //     // "border-bottom": "5px solid red"
          //   }}
          style={TooltipStyle}
          placement="top"
          isOpen={tooltipOpen}
          target={'Tooltip-' + id}
          toggle={toggle}
          >
          {label}
        </Tooltip> */}
      </div>
        </Tooltip>
    </div>
  );
};

export default DotRadar;