import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setAuthToken } from '../api';

const OAuthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      setAuthToken(token);
      navigate('/');
    } else {
      navigate('/login'); 
    }
  }, [navigate]);

  return <p>Авторизация...</p>;
};

export default OAuthRedirect;

