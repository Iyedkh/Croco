import React from 'react';
import { useLocation } from 'react-router-dom';
import './BackgroundAnimation.css';

const BackgroundAnimation = ({ children }) => {
  const location = useLocation();
  console.log('Current Path:', location.pathname);  // Debug line

  // Determine the background class based on the route
  let bgClass = 'default-bg';  // Set the default background
  if (location.pathname.includes('/Stores/1') || location.pathname.includes('/CrocoNutritionProducts')) {
    bgClass = 'nutrition-bg';
  } else if (location.pathname.includes('/Stores/2') || location.pathname.includes('/CrocoWearProducts')) {
    bgClass = 'wear-bg';
  } else if (location.pathname.includes('/Stores/3') || location.pathname.includes('/CrocoTeamProducts')) {
    bgClass = 'team-bg';
  }

  return (
    <>
      <div id="bg" className={bgClass}></div>
      <div id="main-content">
        {children}
      </div>
    </>
  );
}

export default BackgroundAnimation;
