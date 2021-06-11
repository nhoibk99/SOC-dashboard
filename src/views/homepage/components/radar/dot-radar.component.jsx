import React from 'react';
import Tooltip from '@material-ui/core/Tooltip';
import {
  createMuiTheme,
  MuiThemeProvider,
  withStyles
} from "@material-ui/core/styles";

const defaultTheme = createMuiTheme();

const MyTooltip = withStyles({
  tooltip: {
    color: "black",
    backgroundColor: "white"
  },
  arrow: {
    color: "white"
  }
})(Tooltip);

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
  // const [tooltipOpen, setTooltipOpen] = useState(false);
  // const toggle = () => setTooltipOpen(!tooltipOpen);
  const {x, y, label, id, color} = dotData;
  const [left, top] = getTopLeft(x, y, r);
  const nodeType = label.split('.')[1].split(' ')[0];
  // const TooltipStyle = {
  //   backgroundColor:'#FFF',
  //   color: "black",
  //   borderStyle: "solid",
  //   borderWidth: "10px",
  //   borderColor: "blue",
  // };
  // {console.log('nodeType',nodeType)}
  return (
    <div className="dot-radar" style={{left, top, backgroundColor: color}} >
        <MuiThemeProvider theme={defaultTheme}>
            <MyTooltip 
              arrow  
              title={label} 
              // open={true}
            >
              <div className={nodeType === 'critical' ? "border-dot-critical" :"border-dot"} id={'Tooltip-' + id}>
              </div>
            </MyTooltip>
        </MuiThemeProvider>
    </div>
  );
};

export default DotRadar;