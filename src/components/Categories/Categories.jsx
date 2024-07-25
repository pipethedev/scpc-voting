import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Category from "./Category";
import { validateStudent } from "../../http/requests";
import ErrorMessage from "../ErrorMessage";
import duck from "../../assets/duck.gif";
import Cookies from "js-cookie";

const Categories = ({ isVoted }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const urlToken = queryParams.get("token");

  const [validateStatus, setValidateStatus] = useState(false);
  const [error, setError] = useState("");
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = urlToken || Cookies.get("voteToken");

    if (!token) {
      window.location.href = "http://localhost:3000/";
    } else {
      if (urlToken) {
        Cookies.set("voteToken", urlToken, { expires: 3 });
      }
    }

    const validation = async (token) => {
      try {
        const response = await validateStudent(token);
        if (response.response.status !== 200) {
          setError(response.responseData.error);
          setValidateStatus(false);
          setLoading(false);
        } else {
          setValidateStatus(true);
        }
      } catch (error) {
        setValidateStatus(false);
        setLoading(false);
        setError(error.message || "An error occurred");
      }
    };

    const getCategories = async () => {
      try {
        const response = await validateStudent(token);
        setCategory(response.responseData.user.categories);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };

    if (token) {
      validation(token);
      getCategories(token);
    } else {
      setLoading(false);
      setError("No token found");
    }
  }, [urlToken]);

  const renderCategories = category.map((value) => (
    <Category key={value.id} data={value} isVoted={isVoted} />
  ));

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
