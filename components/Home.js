import React from 'react';
// emotion imports 
import {ThemeProvider} from "@emotion/react";
import styled from "@emotion/styled";
import { Global, css } from '@emotion/react';


import { useState, useEffect} from 'react';
import { Popover, Button, Input } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FaSun, FaMoon } from 'react-icons/fa';

import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';

import Movie from './Movie';
import 'antd/dist/antd.css';


//emotion styles :
// 1st => theme objects : 
const lightTheme ={
  background: 'linear-gradient(#e66465, #9198e5)',
  text:'#000F36',
  primary:'white',
}
const darkTheme ={
  background:'#121212',
  text:'#ffffff',
  primary:'#121212',
}
// 2nd let's define the styled components:

const AppContainer = styled.div`
  display: flex;
  flex-direction:column;
  align-items:center;
  flex-wrap:wrap;
  width:100vw;
  background-color:${props=> props.theme.background};
  color: ${props=>props.theme.text};
`;

const Header = styled.header`
  display:flex;
  width:100vw;
  justify-content:space-between;
  height:9vh;
  padding:5px;
  background-color: ${props=>props.theme.primary};
`;

const ImagePropLeft = styled.span`
  display:flex;
  height: 98%;
  width: 50%;
  gap: 50px;
`;

const ImagePropRight = styled.span`
  display:flex;
  gap:40px;
  padding:30px;
  height: 75%;
  align-items:center;
`;

const ThemeToggle = styled.button`
  background-color: ${props=>props.theme.background};
  color= ${props=>props.theme.text};
  border: 1px solid ${props=>props.theme.text};
  padding:0.5rem 1rem;
  cursor:pointer;
  display:flex;
  align-items:center;
  justify-content:center;
  border-radius:15px;
`;

const InputText = styled.input`
display:flex;
margin-top:40px;
color:black;
justify-content:center;
border-radius:10px; 
border: solid 3px #B5702F;
font-family:helvetica;
align-items:center;
width:50%;
`;

const MovieTitles = styled.h1`
  display:flex;
  font-family: SF Pro, Helvetica Neue;
  color:${props=>props.theme.text};
  font-size:400;
  font-weight:800;
  margin-bottom:0;
  margin-top:50px;
`;


const MoviesContainer = styled.div`
  display:flex;
  justify-content:center;
  overflow:scroll;
  width:100vw;
  height:100vh;
  mask-image:linear-gradient(to right, black 50px, black calc(80% - 80px), transparent 100%);
  margin-top:0;
  gap:30px;
  padding:5px;
`;

const GLobalStyles = css `
  body {
    margin: 0;
    font-family: SF Pro, helvetica neue, -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;'
  }
`;

function Home() {

  const [isDarkMode, setIsDarkMode]=useState(false);
  const theme = isDarkMode ? darkTheme : lightTheme;

  const [likedMovies, setLikedMovies] = useState([]);
  const [moviesData, setMoviesData]=useState([]);
  const [topRatedOnes, setTopRatedOnes]=useState([]);



  useEffect(() => {
    fetch('https://mymovizpart5backend-snowy.vercel.app/movies')
    .then(results => results.json())
    .then(data => {
      console.log('👨🏻‍💻retrieved data 💫', data)
      const movies = []
      for (const movie of data.movies) {
        movies.push({ 
          title: movie.title,
          voteAverage: movie.vote_average,
          voteCount: movie.vote_count,
          overview: movie.overview.substring(0,250)+"...",
          poster: "https://image.tmdb.org/t/p/w500"+movie.poster_path,

          });
  //   { title: 'The Dark Knight', poster: 'thedarkknight.jpg', voteAverage: 8.5, voteCount: 27_547, overview: 'Batman raises the stakes in his war on crime and sets out to dismantle the remaining criminal organizations that plague the streets.' }

      }
      setMoviesData(movies)
    })
  }, [] )

  useEffect(()=> {
    try {
    fetch('https://api.themoviedb.org/3/movie/upcoming')
    .then(results=> results.json())
    .then(data => {
    console.log('🎯 UpcomingMovies data:', data)
    setTopRatedOnes(data.upcomingMovies)
    });
    } catch {
      console.error('Failed To Fetch upcomingMovies', err)
    }
  }, []);

  // Liked movies (inverse data flow)
  const updateLikedMovies = (movieTitle) => {
    if (likedMovies.find(movie => movie === movieTitle)) {
      setLikedMovies(likedMovies.filter(movie => movie !== movieTitle));
    } else {
      setLikedMovies([...likedMovies, movieTitle]);
    }
  };

  const likedMoviesPopover = likedMovies.map((data, i) => {
    return (
      <div key={i}>
        <span>{data}</span>
        <FontAwesomeIcon icon={faCircleXmark} onClick={() => updateLikedMovies(data)}/>
      </div>
    );
  });

  const popoverContent = (
    <div>
      {likedMoviesPopover}
    </div>
  );

  const topRatedMovies = topRatedOnes?.map((data,i) => {
      const isLiked2 = likedMovies.some(movie=>movie===data.name);
      return <Movie key={i} isliked2={isLiked2} title={results.name} overview={results.overview} poster={results.backdrop_path} voteAverage={results.vote_average} voteCount={results.vote_count} />

  });

  const movies = moviesData.map((data, i) => {
    const isLiked = likedMovies.some(movie => movie === data.title);
    return <Movie key={i} updateLikedMovies={updateLikedMovies} isLiked={isLiked} title={data.title} overview={data.overview} poster={data.poster} voteAverage={data.voteAverage} voteCount={data.voteCount} />;
  });

  const switchMode =()=> isDarkMode ? <FaMoon/> : <FaSun/>

  return (
    <ThemeProvider theme={theme}>
      <Global styles={GLobalStyles} />
      <AppContainer> 
        <Header>
          <ImagePropLeft>    
            <img src="logo.png" alt="Logo" />
            <img src="logoletter.png" alt="Letter logo" />
          </ImagePropLeft>
          <ImagePropRight>
          <ThemeToggle 
            aria-label={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            onClick={()=> setIsDarkMode(!isDarkMode)}>{switchMode()}
          </ThemeToggle>
          <Popover title="Liked movies" content={popoverContent} trigger="click">
            <Button>♥ {likedMovies.length} movie(s)</Button>
          </Popover>
          </ImagePropRight>
        </Header>
        <InputText placeholder="Find a movie 🍿"></InputText>
        <MovieTitles>Latest Releases</MovieTitles>
        <MoviesContainer>
          {movies}
        </MoviesContainer>
        <MoviesContainer>
          {topRatedMovies}
        </MoviesContainer>
      </AppContainer>
    </ThemeProvider>
  );
}

export default Home;