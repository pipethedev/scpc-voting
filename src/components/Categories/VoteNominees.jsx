import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import ErrorMessage from "../ErrorMessage";
import nomineePic from "../../assets/nominee.png";
import { nomineeRequest, validateStudent, vote } from "../../http/requests";
import { background, CircularProgress } from "@chakra-ui/react";
import Cookies from "js-cookie";
import { motion } from "framer-motion";
import { toast } from "sonner";

const VoteNominees = ({ doneVoting }) => {
  const { id: urlId } = useParams();
  const [nomineeData, setNomineeData] = useState([]);
  const [categoryId, setCategoryId] = useState();
  const [nomineeId, setNomineeId] = useState("");
  const [nomineeStatus, setNomineeStatus] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("voteToken");

    if (!token) {
      setError("No token found");
      setLoading(false);
      return;
    }

    setLoading(true);
    const getNomineesData = async () => {
      try {
        const response = await nomineeRequest(urlId);
        console.log("RESP", response.responseData);
        setNomineeData(response?.responseData?.nominees?.rows);

        if (response?.responseData?.nominees?.count > 0) {
          setLoading(false);
          setCategoryName(response.responseData.rows[0].Category.category);
          setCategoryId(response.responseData.rows[0].CategoryId);
          console.log(
            `categoryName: ${response.responseData.rows[0].Category.category}`,
          );
          console.log(
            `categoryId: ${response.responseData.rows[0].CategoryId}`,
          );
        } else {
          setNomineeStatus(true);
          setError("Invalid Nominee");
        }
      } catch (error) {
        setLoading(false);
        //toast.error(error.message || "An error occurred");
      }
    };
    getNomineesData();
  }, [urlId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    if (!nomineeId) {
      toast.error("No nominees selected");
      return;
    }

    const token = Cookies.get("voteToken");
    if (!token) {
      toast.error("Voter is not authenticated");
      return;
    }

    try {
      const handleVoting = async () => {
        const response = await validateStudent(token);

        const votingData = {
          VoterId: response.responseData.user.userId,
          NomineeId: nomineeId,
          CategoryId: urlId,
        };

        const voteResponse = await vote(votingData, token);
        if (voteResponse.responseData.error) {
          toast.error(
            voteResponse.responseData.error || "An error occurred while voting",
          );
        } else {
          setLoading(false);
          toast.success(voteResponse.responseData.message, { duration: 3000 });
          navigate(-1);
        }
      };
      await handleVoting();
    } catch (error) {
      setLoading(false);
      toast.error(error.message || "An error occurred", "error");
    }
  };

  const renderNominees = nomineeData.map((value, index) => {
    const isSelected = nomineeId === value.id;

    const handleRadioChange = () => {
      if (isSelected) {
        setNomineeId("");
      } else {
        setNomineeId(value.id);
      }
    };

    return (
      <motion.div
        className="nominee-inside"
        key={value.id}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="nom-img">
          <div
            className="w-80 h-96"
            style={{
              backgroundImage: `url(${value.pictureUrl || nomineePic})`,
              backgroundSize: "cover",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
            }}
          ></div>
        </div>
        <div>
          <p>
            {value.firstName} {value.lastName}
          </p>
        </div>
        <div>
          <input
            className="vote-input cursor-pointer"
            value={value.id}
            type="radio"
            onChange={handleRadioChange}
            checked={isSelected}
            required
          />
        </div>
      </motion.div>
    );
  });

  return (
    <div>
      {nomineeStatus ? (
        <ErrorMessage message={error} />
      ) : loading ? (
        <div className="spinner">
          <CircularProgress isIndeterminate color="#db940c" />
        </div>
      ) : (
        <div>
          <div className="cat-header cursor-pointer">
            <Link to="/vote">VOTING</Link>
            <span>{categoryName}</span>
          </div>
          <div className="renderNominees">{renderNominees}</div>
          <div className="btns">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              class="text-white text-xl bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg px-5 py-2.5 me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800 p-8"
            >
              {loading ? "Voting..." : "Vote"}
            </button>

            <button
              type="button"
              onClick={() => setNomineeId("")}
              class="focus:outline-none text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-xl px-5 py-2.5 me-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900"
            >
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoteNominees;
