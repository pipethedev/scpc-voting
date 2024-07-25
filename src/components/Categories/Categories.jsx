import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Category from "./Category";
import { validateStudent } from "../../http/requests";
import ErrorMessage from "../ErrorMessage";
import duck from "../../assets/duck.gif";
import Cookies from "js-cookie";
import { HoverEffect } from "../Card";
import Confetti from "react-confetti";

const Categories = ({ isVoted }) => {
  const location = useLocation();

  const [validateStatus, setValidateStatus] = useState(false);
  const [error, setError] = useState("");
  const [category, setCategory] = useState([]);
  const [loading, setLoading] = useState(true);

  const [urlToken, setToken] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenValue = queryParams.get('token');
    setToken(tokenValue);
  }, [location.search]);

  useEffect(() => {
    const token = urlToken || Cookies.get("voteToken");

    if (!token) {
      window.location.href = "";
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
        <div className="flex flex-col items-center justify-center container mx-auto py-10">
          <div className="header">
            <p className="text-center text-2xl font-bold">CATEGORIES</p>
          </div>
          {category.length !== 0 ? (
            <HoverEffect items={category} />
          ) : (
            <>
              <Confetti
                drawShape={(ctx) => {
                  ctx.beginPath();
                  for (let i = 0; i < 22; i++) {
                    const angle = 0.35 * i;
                    const x = (0.2 + 1.5 * angle) * Math.cos(angle);
                    const y = (0.2 + 1.5 * angle) * Math.sin(angle);
                    ctx.lineTo(x, y);
                  }
                  ctx.stroke();
                  ctx.closePath();
                }}
              />
              <div className="doneVoting text-center">
                <p className="font-extrabold text-3xl">
                  You've voted for all the categories
                </p>
                <div className="duck">
                  <img src={duck} alt="duck" />
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        <ErrorMessage message={error} />
      )}
    </div>
  );
};

export default Categories;
