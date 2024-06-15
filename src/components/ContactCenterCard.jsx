import React from "react";
import SchoolOfCreativeTechnology from "../assets/School_of_Creative_Technology.png";

function ContactCenterCard(props) {
  return (
    <>
      <button className="flex flex-wrap justify-center rounded-1xl bg-greyfield min-w-[40vh] max-w-[40vh] shadow-md my-3 ml-7 px-5 overflow-hidden font-sans">
        <img
          src={SchoolOfCreativeTechnology}
          alt="School of Creative Technology"
          className="w-full h-[23vh] bg-beige flex flex-end justify-end align-top object-contain"
          resizeMode="covern"
        />
        <div className="flex flex-col">
          <div className="font-bold text-xl mb-2">{props.title}</div>
          <p className="text-sm">{props.description}</p>
          <p className="text-sm mt-5">{"Telp:022 – 2056 8888"}</p>
        </div>
      </button>
    </>
  );
}

export default ContactCenterCard;
