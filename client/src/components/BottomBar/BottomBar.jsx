import React, { useState } from "react";
import "./bottomBar.css";

import { styled } from "@mui/material/styles";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DoneIcon from "@mui/icons-material/Done";
import axios from "axios";

export default function BottomBar({
  fileSelected,
  filed,
  change,
  handleCLick,
}) {
  return (
    <div className={filed ? "bottomBarWrapper coverUp" : "bottomBarWrapper"}>
      <label htmlFor={filed ? "submit" : "choose"}>
        {filed ? (
          <DoneIcon className="uploadBtn" />
        ) : (
          <CloudUploadIcon className="uploadBtn2" />
        )}
      </label>
      <form action="/" method="POST" enctype="multipart/form-data">
        <input
          className="toHide"
          type="file"
          name="filetoupload"
          id="choose"
          onChange={change}
          multiple
        />
        <input
          className="toHide"
          type="submit"
          value="Upload"
          id="submit"
          onClick={handleCLick}
        />
      </form>
      <div className="inputName">
        <h4>{filed ? filed.name : ""}</h4>
      </div>
    </div>
  );
}
