import React from "react";
import VotingForm from "./VotingForm";
import Results from "./Results";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./Login";

const App = () => {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <div>
                <VotingForm />
              </div>
            }
          />{" "}
          {/* Render both on the same page */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
