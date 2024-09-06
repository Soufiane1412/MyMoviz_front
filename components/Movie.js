import React from 'react';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faStar, faVideo } from '@fortawesome/free-solid-svg-icons';
//emotion imports
import styled from "@emotion/styled";
import { Global, css } from '@emotion/react';


const MovieCard = styled.div`
  
  gap:20px;
`;

const Poster = styled.img`
`;

const MovieInfo = styled.p`
`;


function Movie(props) {

  const [watchCount, setWatchCount] = useState(0);
  const [personalNote, setPersonalNote] = useState(0);


  // Average evaluation
  const stars = [];
  for (let i = 0; i < 10; i++) {
    let style = {};
    if (i < props.voteAverage - 1) {
      style = { 'color': '#f1c40f' };
    }
    stars.push(<FontAwesomeIcon key={i} icon={faStar} style={style} />);
  }

  // Watch movie
  const handleWatchMovie = () => {
    setWatchCount(watchCount + 1);
  };
  let videoIconStyle = { 'cursor': 'pointer' };
  if (watchCount > 0) {
    videoIconStyle = { 'color': '#e74c3c', 'cursor': 'pointer' };
  }

  // Like movie
  const handleLikeMovie = () => {
    props.updateLikedMovies(props.title);
  };
  let heartIconStyle = { 'cursor': 'pointer' };
  if (props.isLiked) {
    heartIconStyle = { 'color': '#e74c3c', 'cursor': 'pointer' };
  }

  // Personal note
  const personalStars = [];
  for (let i = 0; i < 10; i++) {
    let style = { 'cursor': 'pointer' };
    if (i < personalNote) {
      style = { 'color': '#2196f3', 'cursor': 'pointer' };
    }
    personalStars.push(<FontAwesomeIcon key={i} icon={faStar} onClick={() => setPersonalNote(i + 1)} style={style} className="note" />);
  }

  return (
      <MovieCard>
        <Poster src={props.poster} alt={props.title} />
        <MovieInfo>
          <span>{props.title}</span>
          <p>{props.overview}</p>
          {stars}({props.voteCount})
          {personalStars}({personalNote})
          <FontAwesomeIcon icon={faVideo} onClick={() => handleWatchMovie()} style={videoIconStyle} className="watch" />({watchCount})
          <FontAwesomeIcon swapOpacity icon={faHeart} onClick={() => handleLikeMovie()} style={heartIconStyle} className="like" />
        </MovieInfo>
      </MovieCard>

  );
}

export default Movie;
