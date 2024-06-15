import Card from "./Card";
import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebaseSetup";

function NavbarAdmin() {
  const navigate = useNavigate();
  const handleClick = (title) => {
    if (title === "Dashboard") {
      navigate("/admin");
    } else {
      auth.signOut();
      navigate("/signin");
    }
  };
  return (
    <nav className=" bg-bluenav min-h-screen pt-10 top-0 left-0 fixed p-5 w-fill flex flex-col font-sans">
      <div className="flex flex-col text-center ">
        <div className="text-4xl font-semibold mb-10">Dodoru</div>
        <Card title="Logout" handleClick={handleClick} />
        <div className="my-10">Logged in as admin</div>
      </div>
    </nav>
  );
}

export default NavbarAdmin;
