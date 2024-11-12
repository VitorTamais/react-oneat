import React from 'react';
import { DarkMode, LightMode } from '@mui/icons-material';
import SalesAnalytics from './SalesAnalytics';
import { useAuth } from '@/context/authContext';

const RightPanel = () => {
  const { proprietario, restaurante } = useAuth();

  return (
    <div className="right">
      <div className="top">
        <button id="menu-btn">
          <span className="material-icons">menu</span>
        </button>
        <div className="theme-toggler">
          <LightMode />
          <DarkMode />
        </div>
        <div className="profile">
          <div className="info">
            <p>Olá, <b>{proprietario?.nome}</b></p>
            <small className="text-muted">Admin</small>
          </div>
          <div className="profile-photo">
            <img src="../assets/images/user-1.png" alt="User" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
