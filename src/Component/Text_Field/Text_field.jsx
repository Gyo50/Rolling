import React from "react";
import Input from "./Input";
import SelectBox from "./SelectBox";
import Froala from "./Froala";

function Text_field() {
  return (
    <>
      <div style={{ marginBottom: "50px" }}>
        <Input />
      </div>
      <div style={{ marginBottom: "50px" }}>
        <Froala />
      </div>
      <div>
        <SelectBox />
      </div>
    </>
  );
}

export default Text_field;
