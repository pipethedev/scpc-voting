import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Category from "./Category";
import { validateStudent } from "../../http/requests";
import ErrorMessage from "../ErrorMessage";
import duck from "../../assets/duck.gif";

const Categories = ({ isVoted }) => {
  const token = useParams();
  const [validateStatus, setValidateStatus] = useState(false);
  const [error, setError] = useState("");
  // const [voterId, setVoterId] = useState();
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [isCategory, setIsCategory] = useState(false);

  useEffect(() => {
    const validation = async (token) => {
      try {
        const response = await validateStudent(token.token);
        if (response.response.status !== 200) {
          setError(response.responseData.error);
          setValidateStatus(false);
          setLoading(false);
        } else {
          setValidateStatus(true);
          // setVoterId(response.responseData.userId);
        }
      } catch (error) {
        setValidateStatus(false);
        setLoading(false);
        setError(error);
      }
    };
    validation(token);

    const getCategories = async () => {
      try {
        const response = await validateStudent(token.token);
        setCategory(response.responseData.categories);
        console.log(category);
        console.log(category.length);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    getCategories(token);
  }, [token]);

  const renderCategories = category.map((value) => {
    return <Category data={value} isVoted={isVoted} />;
  });

  return (
    <div>
      {loading ? (
        <div className="loading-skeleton">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="category-skeleton"></div>
          ))}
        </div>
      ) : validateStatus ? (
        <div>
          <div className="header">
            <p>CATEGORIES</p>
          </div>
          {category.length !== 0 ? (
            <div className="cat-grid">{renderCategories}</div>
          ) : (
            <div className="doneVoting">
              <div>You've voted for all the categories</div>
              <div className="duck">
                <img src={duck} alt="duck" />
              </div>
            </div>
          )}
        </div>
      ) : (
        <ErrorMessage message={error} />
      )}
    </div>
  );
};

export default Categories;
