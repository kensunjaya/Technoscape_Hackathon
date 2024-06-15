import React from "react";
import InfoUniversity from "../assets/InfoUniversity.png";
import Faq from "../assets/FAQ.png";
import History from "../assets/History.png";

function Card(props) {
  return (
    <>
      <button
        className="flex items-center rounded-3xl bg-bluefield py-5 min-w-full my-3 px-10 overflow-hidden font-sans"
        onClick={() => props.handleClick(props.title)}
      >
        <img
          src={
            props.title === "Info University"
              ? InfoUniversity
              : props.title === "FAQ Bot"
              ? Faq
              : History
          }
          alt="Info University"
          className="flex-column w-8 h-full mx-7 object-contain"
        />
        <div className="items-center justify-start font-regular mx-7 my-5 ml-3 text-lg">
          {props.title}
        </div>
      </button>
    </>
  );
}

export default Card;
