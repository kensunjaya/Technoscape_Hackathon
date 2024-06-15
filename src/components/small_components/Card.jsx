function Card(props) {
  return (
    <button className="flex items-center justify-center rounded-3xl bg-lightgrey min-w-[8rem] max-w-[20rem] shadow-md my-3 mx-2 px-3 py-2 overflow-hidden font-sans text-xs">
      {props.title}
    </button>
  );
}

export default Card;
