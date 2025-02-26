// src/components/ui/button.js
import React from "react";

const Button = ({ children, onClick }) => {
  return (
    <button onClick={onClick} style={{ padding: "10px", fontSize: "16px" }}>
      {children}
    </button>
  );
};

export default Button;
