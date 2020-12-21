import React, { useState } from 'react';

import { ReactComponent as Signal1SVG } from '../images/signal-1.svg';
import { ReactComponent as Signal2SVG } from '../images/signal-2.svg';
import { ReactComponent as Signal3SVG } from '../images/signal-3.svg';
import { ReactComponent as Signal4SVG } from '../images/signal-4.svg';
import { ReactComponent as Signal5SVG } from '../images/signal-5.svg';

import { Tooltip } from "reactstrap";

const LatencyDisplay = (props) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggle = () => setTooltipOpen(!tooltipOpen);

  let latency = props.latency;

  if (latency === 0 || latency === undefined) {
    return null;
  }

  let icon = (<Signal1SVG height="20px" />);

  if (latency <= 500) {
    icon = (<Signal2SVG height="20px" />);
  }
  if (latency <= 300) {
    icon = (<Signal3SVG height="20px" />)
  }
  if (latency <= 200) {
    icon = (<Signal4SVG height="20px" />);
  }
  if (latency <= 125) {
    icon = (<Signal5SVG height="20px" />);
  }

  let latencyStr;
  if (props.showMS) {
    latencyStr = (<span>&nbsp;&nbsp;&nbsp;{latency} mS</span>);
  }

  return (
      <div>
        <span id="latency">{icon}{latencyStr}</span>
        <Tooltip placement="right" isOpen={tooltipOpen} target="latency" toggle={toggle}>
          {latency} mS latency
        </Tooltip>
      </div>
  );
}

export default LatencyDisplay;