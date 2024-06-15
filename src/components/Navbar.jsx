import Card from "./Card";
import React from "react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const handleClick = (title) => {
    if (title === "Info University") {
      navigate("/info");
    } else if (title === "FAQ Bot") {
      navigate("/");
    } else {
      navigate("/history");
    }
  };
  return (
    <nav className=" bg-bluenav min-h-screen pt-10 top-0 left-0 fixed p-5 w-fill flex flex-col font-sans">
      <div className="flex flex-col text-center ">
        <div className="text-4xl font-semibold mb-10">Dodoru</div>
        <Card title="Info University" handleClick={handleClick} />
        <Card title="FAQ Bot" handleClick={handleClick} />
        <Card title="History" handleClick={handleClick} />
      </div>
    </nav>
  );
}

export default Navbar;
