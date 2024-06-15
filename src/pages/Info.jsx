import Navbar from "../components/Navbar";
import React from "react";
import BinusUniversityLogo from "../assets/BinusUniversityLogo.png";
import ImageCaroulser from "../components/ImageCaroulser";

function Info() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
        rel="stylesheet"
      ></link>
      <div className="w-screen min-h-screen flex font-sans bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-start w-full">
          <img
            src={BinusUniversityLogo}
            alt="Binus University Logo"
            className="w-32 my-10 object-contain"
          />
          <ImageCaroulser />
        </div>
      </div>
    </>
  );
}

export default Info;
