import React, { useState } from "react";
import logo from "../../assets/logo.svg";
import { CircularProgress } from "@chakra-ui/react";
import { registrationRequest } from "../../http/requests";
import Redirect from "./Redirect";

const Register = () => {
  const [data, setData] = useState("");
  const [regNo, setRegNo] = useState("");
  const [webmail, setWebmail] = useState("");
  // const [mainWebmail, setMainWebmail] = useState("");
  const [registering, setRegistering] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showRedirectMsg, setShowRedirectMsg] = useState(false);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setRegistering(true);

  //   try {
  //     const validateEmail = (email) => {
  //       const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  //       const domainRegex = /@lmu\.edu\.ng$/;
  //       const isValidEmail = emailRegex.test(email) && domainRegex.test(email);

  //       return isValidEmail;
  //     };

  //     const validWebmail = validateEmail(webmail);
  //     if (validWebmail) {
  //       setMainWebmail(webmail);
  //     } else {
  //       setErrorMsg("Invalid Details");
  //     }

  //     const regData = {
  //       matricNo: regNo,
  //       emailAddress: mainWebmail,
  //     };
  //     console.log(regData);

  //     const registerStudent = await registrationRequest(regData);
  //     setData(
  //       registerStudent.responseData.emailAddress +
  //         " " +
  //         registerStudent.responseData.matricNo
  //     );
  //     console.log(data);
  //     if (errorMsg != null) {
  //       setShowRedirectMsg(true);
  //       setRegistering(true);
  //     } else {
  //       setShowRedirectMsg(false);
  //       setRegistering(false);
  //     }
  //   } catch (error) {
  //     setRegistering(false);
  //     setShowRedirectMsg(false);
  //     <Redirect message={error} />;
  //   }
  // };

  const handleSubmit2 = async (e) => {
    e.preventDefault();
    // setRegistering(true);

    const validateEmail = (email) => {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const domainRegex = /@lmu\.edu\.ng$/;
      const isValidEmail = emailRegex.test(email) && domainRegex.test(email);

      return isValidEmail;
    };

    const validWebmail = validateEmail(webmail);
    if (validWebmail) {
      const regData = {
        matricNo: regNo,
        emailAddress: webmail,
      };

      console.log(regData);

      const registerStudent = await registrationRequest(regData);

      if (registerStudent.responseData.error) {
        setData(registerStudent.responseData.error);
        console.log(data);
      } else {
        setData(registerStudent.responseData.message);
        console.log(data);
      }

      // console.log(registerStudent.responseData.error);
      // console.log(typeof registerStudent.responseData.error);

      if (errorMsg != null) {
        setShowRedirectMsg(true);
        setRegistering(true);
      } else {
        setShowRedirectMsg(false);
        setRegistering(false);
      }
    } else {
      setErrorMsg("Invalid Details");
      setShowRedirectMsg(false);
      setRegistering(false);
    }

    // console.log(regData);
    // console.log(`mainWebmail: ${mainWebmail}`);
  };

  return (
    <section>
      <div>
        <img src={logo} alt="logo" />
      </div>
      {showRedirectMsg ? (
        <Redirect message={data} />
      ) : (
        <>
          <div className="register">
            <form onSubmit={handleSubmit2}>
              {errorMsg && (
                <div
                  className={`${errorMsg ? "submit-error-msg" : "hide-error"}`}
                >
                  {errorMsg}
                </div>
              )}
              <div className="reg">
                <div className="reg-input">
                  <div className="inside-reg">
                    <label>Reg number | Matric number</label>
                    <input
                      type="text"
                      value={regNo}
                      onChange={(e) => {
                        setRegNo(e.target.value);
                      }}
                      autoFocus
                      required
                    />
                  </div>
                </div>
                <div className="reg-input">
                  <div className="inside-reg">
                    <label>Webmail</label>
                    <input
                      type="email"
                      value={webmail}
                      onChange={(e) => {
                        setWebmail(e.target.value);
                      }}
                      required
                    />
                  </div>
                </div>
                {registering ? (
                  <>
                    <button disabled className="processing-btn">
                      <CircularProgress
                        isIndeterminate
                        color="grey"
                        size="20px"
                      />
                      <p>Processing</p>
                    </button>
                  </>
                ) : (
                  <>
                    <button type="submit" className="submit-btn">
                      Register
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </>
      )}
    </section>
  );
};

export default Register;

// Brand
// Entrepreneur
// Fashion designer
