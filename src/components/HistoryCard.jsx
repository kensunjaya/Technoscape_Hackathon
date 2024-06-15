function HistoryCard(props) {
  return (
    <>
      <button
        className="flex items-center rounded-1xl bg-greyfield min-w-[40vh] max-w-[120vh] shadow-md my-3 px-10 overflow-hidden font-sans"
        onClick={() => props.handleClick(props.title)}
      >
        <div className="flex flex-col">
          <p className="justify-start font-regular mx-7 my-5 ml-3 text-lg">
            {props.description}
          </p>
        </div>
      </button>
    </>
  );
}

export default HistoryCard;
