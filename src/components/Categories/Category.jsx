import React from "react";
import { Link } from "react-router-dom";

const Category = ({ data, isVoted }) => {
  function show() {
    console.log(data.id);
  }
  return (
    <Link
      to={isVoted ? "" : `${data.id}`}
      onClick={show}
      style={{
        width: "80%",
      }}
    >
      <div className={isVoted ? "doneCategory" : "category"}>
        <div className="category-inside">
          <p>{data.category}</p>
        </div>
      </div>
    </Link>
  );
};

export default Category;
