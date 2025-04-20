import React, { useState } from 'react';
import './RatingSystem.css';

const RatingSystem = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the rating to your backend
    console.log('Rating:', rating);
    setRating(0);
  };

  return (
    <div className="rating-container">
      <h3>Rate this movie</h3>
      <div className="rating-stars">
        {[...Array(10)].map((star, index) => {
          const ratingValue = index + 1;
          return (
            <label key={index}>
              <input
                type="radio"
                name="rating"
                value={ratingValue}
                onClick={() => setRating(ratingValue)}
              />
              <span
                className={`star ${ratingValue <= (hover || rating) ? 'filled' : ''}`}
                onMouseEnter={() => setHover(ratingValue)}
                onMouseLeave={() => setHover(0)}
              >
                ★
              </span>
            </label>
          );
        })}
      </div>
      <p className="rating-text">
        {rating ? `You rated this ${rating} out of 10` : 'Select a rating'}
      </p>
      <button 
        onClick={handleSubmit} 
        className="submit-button" 
        disabled={!rating}
      >
        Submit Rating
      </button>
    </div>
  );
};

export default RatingSystem; 