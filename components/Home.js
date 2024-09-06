import React from 'react';
// emotion imports 
import {ThemeProvider} from "@emotion/react";
import styled from "@emotion/styled";
import { Global, css } from '@emotion/react';


import { useState, useEffect} from 'react';
import { Popover, Button, Input } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-solid-svg-icons';
import Movie from './Movie';
import 'antd/dist/antd.css';



const color = 'hotpink';

//emotion styles :
// 1st => theme objects : 
const lightTheme ={
  background: '#ffffff',
  text:'#000000',
  primary: '#511a33',
}
const darkTheme ={
  background:'#121212',
  text:'#ffffff',
  primary:'#073c16',
}
// 2nd let's define the styled components:

const AppContainer = styled.div`
  display: flex;
  flex-direction:column;
  flex-wrap:wrap;
  width:100vw;
  background-color:${props=> props.theme.background};
  color: ${props=>props.theme.text};
  min-height: 100vh;
`;

const Header = styled.header`
  display:flex;
  height:9vh;
  justify-content: space-between;
  align-items: center;
  padding:5px;
  background-color: ${props=>props.theme.primary};
`;

const ImagePropLeft = styled.span`
  display:flex;
  height: 98%;
  width: 50%;
  gap: 20px;
`;

const ImagePropRight = styled.span`
  display:flex;
  gap:20px;
  height: 75%;
  align-items:center;
`;

const ThemeToggle = styled.button`
  background-color: ${props=>props.theme.background};
  color= ${props=>props.theme.text};
  border: 1px solid ${props=>props.theme.text};
  padding:0.5rem 1rem;
  cursor:pointer;
`;

const MoviesContainer = styled.div`
 display:flex;
 flex-direction:column;
 flex-wrap:wrap;
  gap:20px;
`;

const GLobalStyles = css `
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
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


  useEffect(() => {
    fetch('https://mymovizpart5backend-snowy.vercel.app/movies')
    .then(results => results.json())
    .then(data => {
      console.log('👨🏻‍💻retrieved data', data)
      const movies = []
      for (const movie of data.movies) {
        movies.push({
          title: movie.title,
          voteAverage: movie.vote_average,
          voteCount: movie.vote_count,
          overview: movie.overview.substring(0,250)+"...",
          poster: "https://image.tmdb.org/t/p/w500"+movie.poster_path,

          })
  //   { title: 'The Dark Knight', poster: 'thedarkknight.jpg', voteAverage: 8.5, voteCount: 27_547, overview: 'Batman raises the stakes in his war on crime and sets out to dismantle the remaining criminal organizations that plague the streets.' },

      }
      setMoviesData(movies)
    })
  }, [] )

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

  const movies = moviesData.map((data, i) => {
    const isLiked = likedMovies.some(movie => movie === data.title);
    return <Movie key={i} updateLikedMovies={updateLikedMovies} isLiked={isLiked} title={data.title} overview={data.overview} poster={data.poster} voteAverage={data.voteAverage} voteCount={data.voteCount} />;
  });


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
          <ThemeToggle onClick={()=> setIsDarkMode(!isDarkMode)}s>
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </ThemeToggle>
          <Popover title="Liked movies" content={popoverContent} trigger="click">
            <Button>♥ {likedMovies.length} movie(s)</Button>
          </Popover>
          </ImagePropRight>
        </Header>

          <Input placeholder="What's on your mind? 🤔💭"></Input>

        <MoviesContainer>
          {movies}
        </MoviesContainer>
      </AppContainer>
    </ThemeProvider>
  );
}

export default Home;