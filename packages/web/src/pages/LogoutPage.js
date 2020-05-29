// LogoutPage.js
import React from "react";
import { Redirect } from 'react-router-dom';

const LogoutPage = (props) => {

  // TODO - This should really be under a POST request.
  sessionStorage.removeItem('user');

  return (
    <Redirect to='/'/>
  );
}

export default LogoutPage;
