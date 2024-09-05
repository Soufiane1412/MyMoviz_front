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
import styles from '../styles/Home.module.css';
import Image from 'next/image'
import ImageBack from "../assets/napoleon-2023-movie-joaquin-phoenix-portrait-uhd-4k-wallpaper.jpeg";
import { motion, spring } from "framer-motion";
import { Header } from 'antd/lib/layout/layout';


//emotion styles :
const lightTheme ={
  background: '#ffffff',
  text:'#000000',
  primary: '#0D253F',
}
const darkTheme ={
  background:'#121212',
  text:'#ffffff',
  primary:'#90cea1',
}
const AppContainer = styled.div`
  background-color:${props=> props.theme.background};
  color: ${props=>props.theme.text};
  min-height: 100vh;
`;

const Header = styled.header`
  display:flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: ${props=>props.theme.primary};
`;

const ThemeToggle = styled.button`
  background-color: ${props=>props.theme.background};
  color= ${props=>props.theme.text};
  border: 1px solid ${props=>props.theme.text};
  padding:0.5rem 1rem;
  cursor:pointer;
`;

const MoviesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  padding: 2rem;
`;
const GLobalStyles = css `
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
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
      <div key={i} className={styles.likedMoviesContainer}>
        <span className="likedMovie">{data}</span>
        <FontAwesomeIcon icon={faCircleXmark} onClick={() => updateLikedMovies(data)} className={styles.crossIcon} />
      </div>
    );
  });

  const popoverContent = (
    <div className={styles.popoverContent}>
      {likedMoviesPopover}
    </div>
  );

  const movies = moviesData.map((data, i) => {
    const isLiked = likedMovies.some(movie => movie === data.title);
    return <Movie key={i} updateLikedMovies={updateLikedMovies} isLiked={isLiked} title={data.title} overview={data.overview} poster={data.poster} voteAverage={data.voteAverage} voteCount={data.voteCount} />;
  });


  const spring = {
    type: "spring",
    stiffness: 500,
    damping: 20,
  }



  return (
    <ThemeProvider theme={theme}>
      <Global styles={GLobalStyles} />
      <AppContainer>
        <Header>
          <img src="logo.png" alt="Logo" />
          <img src="logoletter.png" alt="Letter logo" />
          <ThemeToggle data-isOn={isOn} onClick={toggleSwitch}>
            <motion.div layout transition={spring}/>
          </ThemeToggle>
          <Popover title="Liked movies" content={popoverContent} className={styles.popover} trigger="click">
            <Button>♥ {likedMovies.length} movie(s)</Button>
          </Popover>
          <Image
          src={ImageBack}
          objectFit='contain'
          fill=''
          priority
          alt='Background'
          />
          <Input placeholder="What's on your mind? 🤔💭"></Input>
        </Header>
          <MoviesContainer>
            {movies}
          </MoviesContainer>
      </AppContainer>
    </ThemeProvider>
  );
}

export default Home;