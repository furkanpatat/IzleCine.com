import React from 'react';
import { useSelector } from 'react-redux';

function BannerHome() {
  const bannerData = useSelector(state => state.IzleCineData?.bannerData ?? []);

  return (
    <div>
      {bannerData.map((movie, index) => (
        <div key={index}>
          <h2>{movie.title || movie.name}</h2>
        </div>
      ))}
    </div>
  );
}

export default BannerHome;
