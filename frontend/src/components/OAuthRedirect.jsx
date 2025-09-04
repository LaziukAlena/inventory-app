import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { setAuthToken } from '../api';

const OAuthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Получаем токен из URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');

    if (token) {
      setAuthToken(token); // сохраняем токен в localStorage
      navigate('/'); // редирект на главную
    } else {
      navigate('/login'); // если токена нет, на страницу логина
    }
  }, [navigate]);

  return <p>Авторизация...</p>;
};

export default OAuthRedirect;

