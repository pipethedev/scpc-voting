import React, { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { registrationRequest } from "../../http/requests";
import Redirect from "./Redirect";
import { toast } from "sonner";

const Register = () => {
  const [data, setData] = useState("");
  const [regNo, setRegNo] = useState("");
  const [webmail, setWebmail] = useState("");
  const [registering, setRegistering] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showRedirectMsg, setShowRedirectMsg] = useState(false);

  const handleSubmit2 = async (e) => {
    e.preventDefault();
    setRegistering(true); // Start processing

    const validateEmail = (email) => {
      const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const domainRegex = /@lmu\.edu\.ng$/;
      return emailRegex.test(email) && domainRegex.test(email);
    };

    const validWebmail = validateEmail(webmail);
    if (validWebmail) {
      const regData = {
        matricNo: regNo,
        emailAddress: webmail,
      };

      try {
        const registerStudent = await registrationRequest(regData);

        if (registerStudent.responseData.error) {
          setData(registerStudent.responseData.error);
          toast.error(registerStudent.responseData.error);
        } else {
          setData(registerStudent.responseData.message);
        }

        if (registerStudent.responseData.error) {
          setShowRedirectMsg(false);
        } else {
          setShowRedirectMsg(true);
        }
      } catch (error) {
        toast.error(
          error?.response?.data?.error ||
            "An error occurred during registration.",
        );
        setShowRedirectMsg(false);
      }
    } else {
      toast.error("Invalid details provided");
      setShowRedirectMsg(false);
    }

    setRegistering(false); // End processing
  };

  return (
    <section className="flex flex-col items-center w-full">
      <center>
        <div className="mt-28 mb-8">
          <img
            src={
              "https://res.cloudinary.com/dzp0iq9mw/image/upload/v1721775211/scpc/449716170_1260964582021173_993437044093772892_n_dreh2f.png"
            }
            alt="logo"
            height={150}
            width={150}
          />
        </div>
      </center>
      {showRedirectMsg ? (
        <Redirect message={data} />
      ) : (
        <center>
          <p className="text-2xl mt-16 hidden md:block font-extrabold">
            Final year dinner
          </p>
          <div
            className="register mt-6"
            style={{
              alignItems: "center",
              alignContent: "center",
            }}
          >
            <form onSubmit={handleSubmit2}>
              {/* {errorMsg && (
                <div
                  className={`${errorMsg ? "submit-error-msg" : "hide-error"}`}
                >
                  {errorMsg}
                </div>
              )} */}
              <div className="reg">
                <div className="reg-input">
                  <div className="inside-reg">
                    <label>Reg number | Matric number</label>
                    <input
                      type="text"
                      value={regNo}
                      onChange={(e) =>
                        setRegNo(e.target.value.toLocaleLowerCase())
                      }
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
                      onChange={(e) =>
                        setWebmail(e.target.value.toLocaleLowerCase())
                      }
                      required
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="submit-btn shadow-md"
                  disabled={registering}
                >
                  {registering ? (
                    <div className="processing-btn">
                      <CircularProgress
                        isIndeterminate
                        color="grey"
                        size="20px"
                      />
                      <p>Processing</p>
                    </div>
                  ) : (
                    "Register"
                  )}
                </button>
              </div>
            </form>
          </div>
        </center>
      )}
    </section>
  );
};

export default Register;
