import React, { useState } from "react";

const Description = () => {
  const [isOpen1, setIsOpen1] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);

  const toggleOpen1 = () => {
    setIsOpen1(!isOpen1);
  };

  const toggleOpen2 = () => {
    setIsOpen2(!isOpen2);
  };

  return (
    <div style={{ display: "flex", width: "300px", flexDirection: "column", marginTop: "1000px", marginLeft: "1000px" }}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div>Хрень 1</div>
        <div
          style={{
            borderTop: "6px solid transparent",
            borderBottom: "6px solid transparent",
            borderLeft: `6px solid ${isOpen1 ? "black" : "red"}`,
            cursor: "pointer",
          }}
          onClick={toggleOpen1}
        />
        {isOpen1 && <div>Хрень 1 описание механик</div>}
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div>Хрень 2</div>
        <div
          style={{
            borderTop: "6px solid transparent",
            borderBottom: "6px solid transparent",
            borderLeft: `6px solid ${isOpen2 ? "black" : "red"}`,
            cursor: "pointer",
          }}
          onClick={toggleOpen2}
        />
        {isOpen2 && <div>Полная хрень 1 описание механик</div>}
      </div>
    </div>
  );
};

export default Description;
