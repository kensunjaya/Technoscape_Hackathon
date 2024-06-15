import React from "react";
import GambarSatu from "../assets/BINUS-@Bandung-gedung.jpeg";

function UniversityInfoCard(props) {
  const Image = props.title === "Why BINUS @Bandung" ? GambarSatu : null;
  return (
    <>
      <button
        className="flex items-center rounded-1xl bg-greyfield min-w-[40vh] max-w-[120vh] shadow-md my-3 px-10 overflow-hidden font-sans"
        onClick={() => props.handleClick(props.title)}
      >
        <div className="flex flex-col">
          <div className="justify-center font-bold mx-7 my-5 ml-3 text-3xl">
            {props.title}
          </div>
          <p className="justify-start font-regular mx-7 my-5 ml-3 text-lg">
            {props.description}
          </p>
        </div>
        <img
          src={Image}
          alt="BINUS @Bandung"
          className="w-50 h-40 object-cover"
        />
      </button>
    </>
  );
}

export default UniversityInfoCard;
