import Navbar from "../components/Navbar";
import React from "react";
import BinusUniversityLogo from "../assets/BinusUniversityLogo.png";
import ImageCaroulser from "../components/ImageCaroulser";
import UniversityInfoCard from "../components/UniversityInfoCard";
import FacultyMemberInfo from "../components/FacultyMemberInfo";
import ContactCenterCard from "../components/ContactCenterCard";

function Info() {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800&display=swap"
        rel="stylesheet"
      ></link>
      <div className="w-screen min-h-screen flex font-sans bg-background">
        <Navbar />
        <div className="flex flex-col items-center justify-start flex-grow ml-64">
          <img
            src={BinusUniversityLogo}
            alt="Binus University Logo"
            className="w-32 my-10 object-contain"
          />
          <div className="w-full max-w-4xl mb-10">
            <ImageCaroulser />
          </div>
          <UniversityInfoCard
            title="Why BINUS @Bandung"
            description="BINUS UNIVERSITY @Bandung hadir untuk menjawab kebutuhan masyarakat Kota Bandung dan sekitar dengan pendidikan berkelas dunia."
          />
          <div className="flex flex-row">
            <FacultyMemberInfo
              title="Faculty & Program Study"
              description="Our programs are designed to shape future leaders. Explore our programs below."
            />
            <ContactCenterCard
              title="Binus @Bandung"
              description="Paskal Hyper Square, Jl. Pasirkaliki No.25-27, Bandung Jawa Barat 40181"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Info;
