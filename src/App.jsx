import React from "react";
import Faq from "./pages/Faq";
import History from "./pages/History";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Info from "./pages/Info";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Faq />} />
          <Route path="/info" element={<Info />} />
          <Route path="/history" element={<History />} />
          <Route path="/signin" element={<Login />} />
          <Route path="/signup" element={<Register />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
