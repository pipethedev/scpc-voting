import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import ErrorMessage from "../ErrorMessage";
import nomineePic from "../../assets/nominee.png";
import { nomineeRequest, validateStudent, vote } from "../../http/requests";
import { CircularProgress, useToast } from "@chakra-ui/react";
import Cookies from "js-cookie";

const VoteNominees = ({ doneVoting }) => {
  const { id: urlId } = useParams();
  const toast = useToast();
  const [nomineeData, setNomineeData] = useState([]);
  const [categoryId, setCategoryId] = useState();
  const [nomineeId, setNomineeId] = useState("");
  const [nomineeStatus, setNomineeStatus] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const showToast = (description, status = "success") => {
    toast({
      description,
      status,
      duration: 9000,
      isClosable: true,
    });
  };

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
        setError(error.message || "An error occurred");
      }
    };
    getNomineesData();
  }, [urlId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nomineeId) {
      console.log("No nominee selected");
      showToast("No nominees selected", "error");
      return;
    }

    const token = Cookies.get("voteToken");
    if (!token) {
      showToast("No token found", "error");
      return;
    }

    try {
      const handleVoting = async () => {
        const response = await validateStudent(token);
        console.log(`voterId2:`, response);

        const votingData = {
          VoterId: response.responseData.user.userId,
          NomineeId: nomineeId,
          CategoryId: urlId,
        };

        const voteResponse = await vote(votingData, token);
        if (voteResponse.responseData.error) {
          showToast(voteResponse.responseData.error, "error");
        } else {
          showToast(voteResponse.responseData.message);
          navigate(-1);
        }
      };
      await handleVoting();
    } catch (error) {
      console.log(error);
      showToast(error.message || "An error occurred", "error");
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
    console.log(`nomineeId: ${nomineeId}`);

    return (
      <div className="nominee-inside" key={value.id}>
        <div className="nom-img">
          <img src={value.pictureUrl || nomineePic} alt={`nominee ${index}`} />
        </div>
        <div>
          <p>
            {value.firstName} {value.lastName}
          </p>
        </div>
        <div>
          <input
            className="vote-input"
            value={value.id}
            type="radio"
            onChange={handleRadioChange}
            checked={isSelected}
            required
          />
        </div>
      </div>
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
          <div className="cat-header">
            <p>VOTING</p>
            <span>{categoryName}</span>
          </div>
          <div className="renderNominees">{renderNominees}</div>
          <div className="btns">
            <button className="vote-btn" onClick={handleSubmit}>
              Vote
            </button>
            <button className="reset-btn" onClick={() => setNomineeId("")}>
              Reset
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoteNominees;
