import React, { useState, useEffect } from 'react';
import './user.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
const { VITE_APP_BACKEND_URL } = import.meta.env;

const FavoriteList = ({ profile }) => {
  const isOwnProfile = profile && profile.isOwnProfile;
  const [currentPage, setCurrentPage] = useState(1);
  const [favoritesPerPage, setfavoritesPerPage] = useState(5);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        if (profile && profile.profileid) {
          const response = await axios.get(`${VITE_APP_BACKEND_URL}/favoritelist/profile/${profile.profileid}`);
          const favoriteData = response.data;
          const favoritesWithMovies = await Promise.all(favoriteData.map(async favorite => {
            try {
              let responseData;
              if (favorite.mediatype === 0) {
                const movieResponse = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/movie/${encodeURIComponent(favorite.favoriteditem)}`);
                responseData = movieResponse.data;
              } else if (favorite.mediatype === 1) {
                const tvResponse = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/series/${encodeURIComponent(favorite.favoriteditem)}`);
                responseData = tvResponse.data;
              }
              if (responseData && (responseData.title || responseData.name)) {
                return {
                  ...favorite,
                  movie: responseData,
                };
              } else {
                return favorite;
              }
            } catch (error) {
              console.error('Hakuvirhe:', error);
              return favorite;
            }
          }));
          setFavorites(favoritesWithMovies);
        }
      } catch (error) {
        console.error('Hakuvirhe:', error);
      }
    };

    fetchFavorites();
  }, [profile]);

  // Poistetaan suosikeista suosikki
  const DeleteFavorite = async (favoriteditem) => {
    try {
      if (profile && profile.profileid) {
        await axios.delete(`${VITE_APP_BACKEND_URL}/favorite/${profile.profileid}/${favoriteditem}`);
        setFavorites(favorites.filter(favorite => favorite.favoriteditem !== favoriteditem)); 
      } else {
        console.error('Profiili-id puuttuu');
      }
    } catch (error) {
      console.error('Ei pystytty poistamaan', error);
    }
  };

  const indexOfLastFavorite = currentPage * favoritesPerPage;
  const indexOfFirstFavorite = indexOfLastFavorite - favoritesPerPage;
  const currentFavorites = favorites.slice(indexOfFirstFavorite, indexOfLastFavorite);

  return (
    <>
      <span className="userinfo">
        Löytyi <b>{favorites.length}</b> Suosikkia.<br />
      </span>
      <ul className="pagination">
        <li>
          <button className="buttonnext" onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}>
            ⯇
          </button>
          &nbsp; <span className="communityinfo">selaa</span> &nbsp;
          <button className="buttonnext" onClick={() => setCurrentPage(currentPage < Math.ceil(favorites.length / favoritesPerPage) ? currentPage + 1 : Math.ceil(favorites.length / favoritesPerPage))}>
            ⯈
          </button>
        </li>
      </ul>
      <ul className="profileSections">
        {currentFavorites.map((favorite, index) => (
          <li key={index}>
            {favorite.mediatype === 0 ? (
              <Link to={`/movie/${favorite.favoriteditem}`}><img className='favoriteimg' src={`https://image.tmdb.org/t/p/w342${favorite.movie.poster_path}`} alt={favorite.movie.title} /></Link>
            ) : (
              <Link to={`/series/${favorite.favoriteditem}`}><img className='favoriteimg' src={`https://image.tmdb.org/t/p/w342${favorite.movie.poster_path}`} alt={favorite.movie.name} /></Link>
            )}

            {favorite.mediatype === 0 ? (
              <Link className='favoritetitle' to={`/movie/${favorite.favoriteeditem}`}>{favorite.movie.title}</Link>
            ) : (
              <Link className='favoritetitle' to={`/series/${favorite.favoriteeditem}`}>{favorite.movie.name}</Link>
            )}  
            {isOwnProfile && (
              <button onClick={() => DeleteFavorite(favorite.favoriteditem)}>Poista</button> 
            )}
          </li>
        ))}
      </ul>
    </>
  );
}

export default FavoriteList;