import React from "react";
import Faq from "./pages/Faq";
import History from "./pages/History";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Info from "./pages/Info";

function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Faq />} />
          <Route path="/info" element={<Info />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
