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
const InputSearch = styled.div`
display:flex;
flex-direction:row;
justify-content:center;
align-items:center;
width:70%;
height:10%;

`;

const InputText = styled.input`
display:flex;
color:black;
justify-content:center;
border-radius:4px; 
border: solid 2px ${props=>props.theme.text};
font-family:helvetica;
align-items:center;
width:50%;
`;

const Press = styled.button`
backgorund-color:${props=> props.theme.background};
color:black;
border: 1px solid ${props=>props.theme.text};
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
  scroll-direction:horizontal;
  width:100vw;
  height:70vh;
  mask-image:linear-gradient(to right, black 50px, black calc(80% - 80px), transparent 100%);
  margin-top:5px;
  gap:9px;

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
  const [upcomingData, setUpcomingData]=useState([]);
  const [moviesError, setMoviesError]=useState(null);
  const [upcomingMoviesError, setUpcomingMoviesError]=useState(null);
  const [fetchedTrendings, setFetchedTrendings]=useState([]);

  //hookState for search feature :
  const [searchTerm, setSearchTerm]=useState("");
  const [searchResults, setSearchResults]=useState([]);
  const [isSearching, setIsSearching]=useState(false);


  const handleSearchInputChange = (e)=> {
    setSearchTerm(e.target.value);
  };


  const handleSearch = async() => {
    if (!searchTerm.trim()) {
      setSearchResults([])
      return;
    }

    setIsSearching(true);
    try{
      const response = await fetch(`https://my-moviz-backend-ruddy.vercel.app/search?query=${searchTerm}`)
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status}`);
      }
      const data = await response.json();
      setSearchResults(data.results);
    } catch(error) {
      console.error('Error whilst fetching search results',error);
    } finally {
      setIsSearching(false);
    }
  };


  useEffect(()=> {
      const fetchMovies = async ()=> {
        try{
          const response = await fetch('https://my-moviz-backend-ruddy.vercel.app/movies');
          if (!response.ok) {
            throw new Error(`HTTP error, status ${response.status}`);
          }
          const data = await response.json();
          console.log('💻 Fetched Discover Movies', data.movies);
          const movies = []
          for (const movie of data.movies) {
            movies.push({
              title: movie.title,
              voteAverage: movie.vote_average,
              voteCount: movie.vote_count,
              overview: movie.overview.substring(0,250) + "...",
              poster: "https://media.themoviedb.org/t/p/w300_and_h450_bestv2/"+movie.poster_path,
            })
          }
          setMoviesData(movies);
        } catch (error) {
          console.error('Error whilst fetching movies', error);
          setMoviesError('Failed to fetch movies, Please try again later');
        }
      };
      fetchMovies()
  }, [])
  
  useEffect(()=> {
    const fetchUpcomingMovies =async ()=> {
      try{
        const response = await fetch('https://my-moviz-backend-ruddy.vercel.app/upcomingMovies');
        if (!response.ok) {
          throw new Error(`HTTP Error status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Fetched UpcomingMovies 🚀', data.upcomingMovies)
        const upcomings = []
        for (const list of data.upcomingMovies) {
          upcomings.push({
              title: list.title,
              voteAverage: list.vote_average,
              voteCount: list.vote_count,
              overview: list.overview.substring(0,250) + "...",
              poster: "https://media.themoviedb.org/t/p/w300_and_h450_bestv2/"+list.poster_path,
            })
          }
          setUpcomingData(upcomings)
        } catch (error) {
          console.error('Failed to fetch /upcomingMovies route: ',error)
          throw error
        }
      }
      fetchUpcomingMovies()
    }, [])

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
  const upcomings = upcomingData.map((data, i)=> {
    const isLiked = likedMovies.some(movie => movie === data.title);
    return <Movie key={i} updateLikedMovies={updateLikedMovies} isLiked={isLiked} title={data.title} overview={data.overview} poster={data.poster} voteAverage={data.voteAverage} voteCount={data.voteCount} />;
  }) 

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
        <InputSearch>
          <InputText
          placeholder="Find a movie 🍿"
          value={searchTerm}
          onChange={handleSearchInputChange}
          />
          <Press onClick={handleSearch}>Search</Press>
        </InputSearch>
        {isSearching ? (
          <div>Searching... 💭</div>
        ) : searchResults.length > 0 ? (
        <MoviesContainer>
          {searchResults.map((movie, i)=> (
            <Movie 
            key={i}
            updateLikedMovies={updateLikedMovies}
            isLiked={likedMovies.some(likedMovie =>likedMovie === movie.title)}
            title={movie.title}
            poster={movie.poster}
            voteAverage={movie.voteAverage}
            />
          ))}
        </MoviesContainer>
        ) : (
          <div>No results found, try agin 🤔</div>
        )}
        <MovieTitles>Latest Releases</MovieTitles>
        <MoviesContainer>
          {moviesError ? (
            <div>{moviesError}</div>
          ) : movies.length > 0 ? (
            movies
          ) : (
            <div>Loading movies...</div>
          )}
        </MoviesContainer>
        <MovieTitles>Upcoming Releases</MovieTitles>
        <MoviesContainer>
          {upcomings}
        </MoviesContainer>
      </AppContainer>
    </ThemeProvider>
  );
}

export default Home;