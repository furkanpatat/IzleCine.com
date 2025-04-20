import React from 'react';
import RatingSystem from '../components/RatingSystem';
import './DetailsPage.css';

const DetailsPage = () => {
  return (
    <div className="details-page">
      <div className="movie-details">
        {/* Movie details content will go here */}
        <h1>Movie Title</h1>
        <p>Movie description and other details...</p>
      </div>
      
      <RatingSystem />
    </div>
  );
};

export default DetailsPage;
