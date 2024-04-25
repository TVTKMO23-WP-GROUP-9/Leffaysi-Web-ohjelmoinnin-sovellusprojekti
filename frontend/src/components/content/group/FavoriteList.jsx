import React, { useState, useEffect } from 'react';
import './group.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
const { VITE_APP_BACKEND_URL } = import.meta.env;

const FavoriteList = ({ id }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [favoritesPerPage, setfavoritesPerPage] = useState(4);
  const [favorites, setFavorites] = useState([]);
  const [editMode, setEditMode] = useState(false);
  
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        
        
          const response = await axios.get(`${VITE_APP_BACKEND_URL}/favoritelist/group/${id}/ANY`);
 
          const favoriteData = response.data;
          console.log(favoriteData);

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
        
      } catch (error) {
        console.error('Hakuvirhe:', error);
      }
    };

    fetchFavorites();
  }, [id]); 
  const handleEditClick = () => {
    setEditMode(!editMode);
  }; 

  // Poistetaan suosikeista suosikki

  const indexOfLastFavorite = currentPage * favoritesPerPage;
  const indexOfFirstFavorite = indexOfLastFavorite - favoritesPerPage;
  const currentFavorites = favorites.slice(indexOfFirstFavorite, indexOfLastFavorite);

  return (
    <>
    
    <ul className="favorite-list">
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

        {currentFavorites.map((favorite, index) => (
          <li key={index}>
            {favorite.mediatype === 0 ? (
           <div className="favorite-poster">
           <img className='favoriteimg' src={`https://image.tmdb.org/t/p/w342${favorite.movie.poster_path}`} alt={favorite.movie.title} />

         </div>
       ) : (
          <div className="favorite-poster">
          <img className='favoriteimg' src={`https://image.tmdb.org/t/p/w342${favorite.movie.poster_path}`} alt={favorite.movie.name} />

  </div>

          )}
            {favorite.mediatype === 0 ? (
              <Link className='favoritetitle' to={`/movie/${favorite.favoriteditem}`}>{favorite.movie.title}</Link>
            ) : (
              <Link className='favoritetitle' to={`/series/${favorite.favoriteditem}`}>{favorite.movie.name}</Link>
            )} 
             
          </li>
          
        ))}

     </ul>

    </>
  );
}

export default FavoriteList;
