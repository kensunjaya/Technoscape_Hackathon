import Card from "./Card";

function Navbar() {
  return (
    <nav className=" bg-bluenav min-h-screen pt-10 p-5 w-fit flex justify-center font-sans">
      <div className="flex flex-col items-center text-center">
        <div className="text-4xl font-semibold mb-10">Dodoru</div>
        <Card title="Info University" />
        <Card title="FAQ Bot" />
        <Card title="History" />
      </div>
    </nav>
  );
}

export default Navbar;
