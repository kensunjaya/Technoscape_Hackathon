import React from 'react';
import Faq from './pages/Faq';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
  <>
    <Router>
      <Routes>
        <Route path="/" element={<Faq />} />
      </Routes>
    </Router>
  </>
  );
}

export default App;
