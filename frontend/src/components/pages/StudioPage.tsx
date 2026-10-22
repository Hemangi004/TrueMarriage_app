import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const StudioPage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/templates', { replace: true });
  }, [navigate]);

  return null;
};
