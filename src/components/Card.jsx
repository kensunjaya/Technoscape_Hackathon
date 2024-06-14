import React from "react";
import InfoUniversity from "../assets/InfoUniversity.png";
import Faq from "../assets/FAQ.png";
import History from "../assets/History.png";

function Card(props) {
  return (
    <>
      <button
        className="flex items-center rounded-3xl bg-bluefield py-5 min-w-full my-3 px-10 overflow-hidden font-sans"
        onClick={props.handleClick}
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
          className="flex-column w-10 h-full mx-7 object-contain rounded-3xl"
        />
        <div className="items-center justify-start font-regular my-5 ml-3 text-xl">
          {props.title}
        </div>
      </button>
    </>
  );
}

export default Card;
