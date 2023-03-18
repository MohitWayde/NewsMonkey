import React, { Component } from "react";
import loading from "./loading.gif";
const Spinner = () => {
  return (
    <div className="text-center">
      <img className="my-3" width={40} src={loading} alt="loading" />
    </div>
  );
};

export default Spinner;
