import React from 'react';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faStar, faVideo } from '@fortawesome/free-solid-svg-icons';
//emotion imports
import styled from "@emotion/styled";
import { Global, css } from '@emotion/react';

const MovieContainer = styled.div`
    display:flex;

`;

const MovieCard = styled.div`
`;

const Poster = styled.img`
  display:flex;
  flex-direction:row;
  flex-wrap:wrap;
  width: 35vw;
  height: 80vh;
  object-fit:cover;
  border-radius:20px;
`;


const MovieInfo = styled.p`
  display:flex;
  flex-direction:column;
  justify-content:center;
  align-items:center;
  flex-wrap:wrap;
  width:100%;
  height:100%;
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
    <MovieContainer >
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
    </MovieContainer>
  );
}

export default Movie;
