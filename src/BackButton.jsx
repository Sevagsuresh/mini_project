import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Go back to the previous page in the history stack
  };

  return (
    <button onClick={handleBack}>Go Back</button>
  );
};

export default BackButton;
