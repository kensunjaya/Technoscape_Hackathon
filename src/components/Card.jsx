import React from "react";
import { useLocation } from "react-router-dom";
import InfoUniversity from "../assets/InfoUniversity.png";
import Faq from "../assets/FAQ.png";
import History from "../assets/History.png";
import Logout from "../assets/Logout.png";
import Dashboard from "../assets/Dashboard.png";

function Card(props) {
  const location = useLocation();

  const pathMapping = {
    "/info": "Info University",
    "/": "Chat Bot",
    "/history": "History",
  };

  const isActive = pathMapping[location.pathname] === props.title;
  const borderClass = props.title === "Logout" ? "border-4 border-red-500" : "";
  const activeClass = isActive ? "bg-blue-500" : "bg-bluefield";

  return (
    <>
      <button
        className={`flex items-center rounded-3xl ${activeClass} ${borderClass} py-5 min-w-full my-3 px-10 overflow-hidden font-sans focus:bg-blue-500 focus:outline-none`}
        onClick={() => props.handleClick(props.title)}
      >
        <img
          src={
            props.title === "Info University"
              ? InfoUniversity
              : props.title === "Chat Bot"
              ? Faq
              : props.title === "Dashboard"
              ? Dashboard
              : props.title === "History"
              ? History
              : Logout
          }
          alt="Image"
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
