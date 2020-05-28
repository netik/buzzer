import NavBar from "../components/NavBar";
import React, { useState, useEffect } from "react";

import {
  Alert
} from "reactstrap";

const HostPage = (props) => {
  let sockErrorComp = null;

  if (props.socketError != null) {
    sockErrorComp = (<Alert color="danger">{props.socketError}</Alert>);
  }
  return (
    <div>
      <NavBar user={props.user} />
      {sockErrorComp}
      <h2>Host services TBD</h2>
    </div>
  )
}

export default HostPage;
