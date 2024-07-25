import React, { useState, useEffect } from "react";
import "./styles/styles.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRegister from "./ProtectedRegister";
import Categories from "./components/Categories/Categories";
import VoteNominees from "./components/Categories/VoteNominees";
import ErrorMessage from "./components/ErrorMessage";

const App = () => {
  const [isVoted, setIsVoted] = useState(false);

  const doneVoting = () => {
    setIsVoted(true);
  };

  return (
    <Router>
      <Routes>
        <Route path="" element={<ProtectedRegister />} />
        <Route path="vote/:token?" element={<Categories isVoted={isVoted} />} />
        <Route
          path="vote/nominees/:id"
          element={<VoteNominees doneVoting={doneVoting} />}
        />
        <Route path="*" element={<ErrorMessage message={"Page not found"} />} />
      </Routes>
    </Router>
  );
};

export default App;