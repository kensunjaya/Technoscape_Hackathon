import React from "react";
import Card from "./small_components/Card";

function FacultyMemberInfo(props) {
  return (
    <>
      <button
        className="flex items-center rounded-1xl bg-greyfield min-w-[40vh] max-w-[74vh] shadow-md my-3 px-5 overflow-hidden font-sans"
        onClick={() => props.handleClick(props.title)}
      >
        <div className="flex flex-col">
          <div className="justify-center font-bold mx-7 my-5 ml-3 text-xl">
            {props.title}
          </div>
          <p className="justify-start font-regular mx-7 my-5 ml-3 text-sm">
            {props.description}
          </p>
          <div className="flex flex-wrap mt-3">
            <Card title="Interaction Design and Technology" />
            <Card title="Computer Science" />
            <Card title="Digital Business Innovation" />
            <Card title="Digital Communication Design" />
            <Card title="Interior Design" />
            <Card title="Creativepreneurship" />
          </div>
        </div>
      </button>
    </>
  );
}

export default FacultyMemberInfo;
