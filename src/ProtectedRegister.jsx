import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import Register from './components/Registration/Register';
import { validateStudent } from './http/requests';

const ProtectedRegister = () => {
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
  
    useEffect(() => {
      const token = Cookies.get("voteToken");
      if (token) {
        validateStudent(token)
          .then(({ response }) => {
            if (response.status === 200) {
              window.location.href = "/vote";
            } else {
              setLoading(false);
            }
          })
          .catch((err) => {
            console.log(err.response?.data || err.message);
            setLoading(false);
          });
      } else {
        setLoading(false);
      }
    }, [navigate]);
  
    if (loading) {
      return null;
    }
  
    return <Register />;
  };
  
  export default ProtectedRegister;