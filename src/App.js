import React, { useState } from "react";
import "./styles/styles.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Registration/Register";
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
        <Route path="" element={<Register />} />
        <Route path="vote/:token" element={<Categories isVoted={isVoted} />} />
        <Route
          path="vote/:token/:id"
          element={<VoteNominees doneVoting={() => doneVoting()} />}
        />
        <Route path="*" element={<ErrorMessage message={"Page not found"} />} />
      </Routes>
    </Router>
  );
};

export default App;
