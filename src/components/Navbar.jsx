import Card from "./Card";

function Navbar() {
  return (
    <nav className=" bg-bluenav min-h-screen pt-10 p-3 min-w-[35vh] flex justify-center font-sans">
      <div className="flex flex-col items-center text-center">
        <div className="text-3xl font-bold my-5">Dodoru</div>
        <Card title="Info University" />
        <Card title="FAQ Bot" />
        <Card title="History" />
      </div>
    </nav>
  );
}

export default Navbar;
