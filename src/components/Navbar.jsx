function Navbar() {
  return (
    <nav className=" bg-bluenav min-h-screen pt-10 p-3 min-w-[35vh] flex justify-center font-sans">
      <div className="flex flex-col items-center text-center">
        <div className="text-3xl font-bold my-5">Dodoru</div>
        <div className='text-white text-xl'>Info University</div>
        <div className='text-white first-line:text-xl'>FAQ Bot</div>
        <div className='text-white text-xl'>History</div>
      </div>
    </nav>
  );
}

export default Navbar;