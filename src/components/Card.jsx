import React from "react";
import InfoUniversity from "../assets/InfoUniversity.png";
import Faq from "../assets/FAQ.png";
import History from "../assets/History.png";

function Card(props) {
  return (
    <>
      <button
        className="flex items-center rounded-3xl bg-bluefield h-[15vh] w-[35vh] my-3 overflow-hidden"
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
        <div className="items-center justify-start font-regular my-5 ml-3">
          {props.title}
        </div>
      </button>
    </>
  );
}

export default Card;
