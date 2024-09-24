import React from 'react';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faStar, faVideo } from '@fortawesome/free-solid-svg-icons';
//emotion imports
import styled from "@emotion/styled";
import { Global, css } from '@emotion/react';


const MovieCard = styled.div`
  display:flex;
  flex-direction:column;
  width:100vw;
  margin-bottom:0;
  padding-bottom:0;
  height:70vh;
  margin:8px;
`;

const Poster = styled.img`
  height:350px;
  width:250px;
  border-radius:25px;
  box-shadow: 10px 6px 4px #0e0925;
  object-fit:cover;
`;

const FlipCard = styled.div`
  background: transparent;
 height:350px;
  width:250px;
  perspective: 800px;
`;

const FlipCardInner = styled.div`
  position: relative;
  border-radius:25px;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.5s;
  transform-style: preserve-3d;
  box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);

  ${FlipCard}:hover & {
    transform: rotateY(180deg);
  }
`;

const FlipCardSide = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
  border-radius: 25px;
  overflow: hidden;
`;

const FlipCardFront = styled(FlipCardSide)`
  background-color: #bbb;
  color: black;
`;

const FlipCardBack = styled(FlipCardSide)`
  background-color: #2980b9;
  color: white;
  transform: rotateY(180deg);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const MovieOverview = styled.div`
  text-align:center;
  color:${props=>props.theme.text};
  font-size:15px;
`;

const MovieInfo = styled.p`
  color:${props => props.theme.text};
  height:25vh;
`;

const MovieTitle = styled.h2`
  margin-top:15px;
  font-family:SF Pro, helvetica neue;
  color:${props=>props.theme.text};
`; 


function Movie(props) {

  const [watchCount, setWatchCount] = useState(0);
  const [personalNote, setPersonalNote] = useState(0);


  // Average evaluation
  const stars = [];
  for (let i = 0; i <5; i++) {
    let style = {};
    if (i < props.voteAverage - 3) {
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
  for (let i = 0; i < 5; i++) {
    let style = { 'cursor': 'pointer' };
    if (i < personalNote) {
      style = { 'color': '#2196f3', 'cursor': 'pointer' };
    }
    personalStars.push(<FontAwesomeIcon key={i} icon={faStar} onClick={() => setPersonalNote(i + 1)} style={style} className="note" />);
  }

  return (
    <MovieCard>
    <FlipCard>
      <FlipCardInner>
        <FlipCardFront>
          <Poster src={props.poster} alt={props.title} />
        </FlipCardFront>
        <FlipCardBack>
          <MovieOverview>{props.overview}</MovieOverview>
        </FlipCardBack>
      </FlipCardInner>
    </FlipCard>
    <MovieInfo>
      <MovieTitle>{props.title}</MovieTitle>
      <p>{stars} ({props.voteCount}) votes</p>
      <p>{personalStars} ({personalNote}) stars</p>
      <p>
        <FontAwesomeIcon icon={faVideo} onClick={() => handleWatchMovie()} style={videoIconStyle} className="watch" /> ({watchCount})
        <FontAwesomeIcon icon={faHeart} onClick={() => handleLikeMovie()} style={heartIconStyle} className="like" />
      </p>
    </MovieInfo>
  </MovieCard>
  );
}

export default Movie;
