import React from 'react';
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

function Home() {
  const [likedMovies, setLikedMovies] = useState([]);
  const [moviesData, setMoviesData]=useState([]);
  const [isOn, setIsOn] =useState(false);

  const toggleSwitch= ()=> setIsOn(!isOn);


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
    <div className={styles.main}>
      <div className={styles.header}>
        <div className={styles.logoContainer}>
          <img src="logo.png" alt="Logo" />
          <img className={styles.logo} src="logoletter.png" alt="Letter logo" />
        </div>
        <div data-isOn={isOn} onClick={toggleSwitch} className={styles.switchContainer}>
          <motion.div className={styles.handle} layout transition={spring}/>
        </div>
        <Popover title="Liked movies" content={popoverContent} className={styles.popover} trigger="click">
          <Button>♥ {likedMovies.length} movie(s)</Button>
        </Popover>
      </div>
      {/* <div className={styles.animContainer}>
        <h1 className={styles.titleDiv}>
          Show me on scroll
        </h1>
        <motion.div
        animate={{
          x:0,
          scale:'1',
          rotate:'0',
          zIndex:'1',
          backgroundColor:'#000',
          boxShadow:'10px 10px 0 rgba(0,0,0, 0.2)',
          position:'fixed',
          transitionEnd: {
            display:'none',
          },
        }}
        />
      </div> */}
      <div className={styles.backgroundContainer}>
        <Image
        src={ImageBack}
        objectFit='contain'
        fill=''
        priority
        alt='Background'
        />
        <div className={styles.floatingBanner}>
          <Input style={{border:"3px" + "linear-gradient(to right, #C04848 0%, #480048  51%, #C04848  100%)"}} 
          placeholder="What's on your mind? 🤔💭" className={styles.topBanner}
          >
          </Input>
        </div>
      </div>

      <div className={styles.moviesContainer}>
        {movies}
      </div>
    </div>
  );
}

export default Home;