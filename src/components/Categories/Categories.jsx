import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Category from "./Category";
import { validateStudent } from "../../http/requests";
import ErrorMessage from "../ErrorMessage";
import duck from "../../assets/duck.gif";
import Cookies from "js-cookie";
import { HoverEffect } from "../Card";

const projects = [
  {
    title: "Stripe",
    description:
      "A technology company that builds economic infrastructure for the internet.",
    link: "https://stripe.com",
  },
  {
    title: "Netflix",
    description:
      "A streaming service that offers a wide variety of award-winning TV shows, movies, anime, documentaries, and more on thousands of internet-connected devices.",
    link: "https://netflix.com",
  },
  {
    title: "Google",
    description:
      "A multinational technology company that specializes in Internet-related services and products.",
    link: "https://google.com",
  },
  {
    title: "Meta",
    description:
      "A technology company that focuses on building products that advance Facebook's mission of bringing the world closer together.",
    link: "https://meta.com",
  },
  {
    title: "Amazon",
    description:
      "A multinational technology company focusing on e-commerce, cloud computing, digital streaming, and artificial intelligence.",
    link: "https://amazon.com",
  },
  {
    title: "Microsoft",
    description:
      "A multinational technology company that develops, manufactures, licenses, supports, and sells computer software, consumer electronics, personal computers, and related services.",
    link: "https://microsoft.com",
  },
];

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
        <div className="flex flex-col items-center justify-center container mx-auto py-10">
          <div className="header">
            <p className="text-center text-2xl font-bold">CATEGORIES</p>
          </div>
          {category.length !== 0 ? (
            <HoverEffect items={category} />
          ) : (
            <div className="doneVoting text-center">
              <p className="font-extrabold text-3xl">
                You've voted for all the categories
              </p>
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
