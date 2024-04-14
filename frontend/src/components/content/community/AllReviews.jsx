import React, { useState, useEffect } from 'react';
import './community.css';
import axios from 'axios';
import { Link } from 'react-router-dom';
const { VITE_APP_BACKEND_URL } = import.meta.env;


const AllReviews = ({ searchTerm, setSearchTerm }) => {

  const [reviews, setReviews] = useState([]);
  const [reviewsPerPage, setReviewsPerPage] = useState(4);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`${VITE_APP_BACKEND_URL}/reviews`);
      const reviewData = response.data;
      
      // Haetaan profiilitiedot
      const reviewsWithProfiles = await Promise.all(reviewData.map(async review => {
        try {
          const userProfileResponse = await axios.get(`${VITE_APP_BACKEND_URL}/profile/id/${review.profileid}`);
          const userProfileData = userProfileResponse.data;
          return { ...review, userProfile: userProfileData };
        } catch (error) {
          console.error('Error fetching profile:', error);
          return review;
        }
      }));


      const reviewsWithMovies = await Promise.all(reviewsWithProfiles.map(async review => {
        try {
          let responseData;
          if (review.mediatype === 0) {
            const movieResponse = await axios.get(`${VITE_APP_BACKEND_URL}/movie/${encodeURIComponent(review.revieweditem)}`);
            responseData = movieResponse.data;
          } else if (review.mediatype === 1) {
            const tvResponse = await axios.get(`${VITE_APP_BACKEND_URL}/series/${encodeURIComponent(review.revieweditem)}`);
            responseData = tvResponse.data;
          }
          if (responseData && (responseData.title || responseData.name)) {
            return {
              ...review,
              movie: responseData,
            };
          } else {
            return review;
          }
        } catch (error) {
          console.error('Fetch error:', error);
          return review;
        }
      }));

      const sortedReviews = reviewsWithMovies.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setReviews(sortedReviews);
    } catch (error) {
      console.error('Hakuvirhe:', error);
    }
  };
  

  const renderRatingIcons = (rating) => {
    const ratingIcons = [];
    for (let i = 0; i < rating; i++) {
      ratingIcons.push(<span key={i} className="review uni06"></span>);
    }
    return ratingIcons;
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };

  const filteredReviews = reviews.filter(review =>
    review.review.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = filteredReviews.slice(indexOfFirstReview, indexOfLastReview);

  
  return (
    <div className='allreviews'>
      <ul className="review-list">
        <li className="userinfo">
          Palvelussa on <b>{filteredReviews.length}</b> arvostelua ja niiden keskiarvo 
          on <b>{filteredReviews.length > 0 && (filteredReviews.reduce((sum, review) => sum + review.rating, 0) / filteredReviews.length).toFixed(1)}</b>.<br />
          Voit luoda uusia arvosteluja elokuvien ja sarjojen sivuilta. <br />

        </li>

        <ul className="pagination">
          <li>
            <button className="buttonnext" onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}>
              ⯇
            </button>
            &nbsp; <span className="communityinfo">selaa</span> &nbsp;
            <button className="buttonnext" onClick={() => setCurrentPage(currentPage < Math.ceil(filteredReviews.length / reviewsPerPage) ? currentPage + 1 : Math.ceil(filteredReviews.length / reviewsPerPage))}>
              ⯈
            </button>
          </li>
        </ul>

        <hr />

        {currentReviews.map((review, index) => (
          <li className='minheightrews' key={index}>
            {review.mediatype === 0 ? (
            <Link to={`/movie/${review.revieweditem}`}><img className='reviewimg' src={`https://image.tmdb.org/t/p/w342${review.movie.poster_path}`} alt={review.movie.title} /></Link>
            ) : (
              <Link to={`/series/${review.revieweditem}`}><img className='reviewimg' src={`https://image.tmdb.org/t/p/w342${review.movie.poster_path}`} alt={review.movie.name} /></Link>
              
            )}
           
            {review.mediatype === 0 ? (
              <Link className='reviewtitle' to={`/movie/${review.revieweditem}`}>{review.movie.title}</Link>
            ) : (
              <Link className='reviewtitle' to={`/series/${review.revieweditem}`}>{review.movie.name}</Link>
            )}    
            <br/>
            
            
            <span>{renderRatingIcons(review.rating)}</span>
            <span className='userinfo'>| <b>{review.rating}/5</b> tähteä</span> <br />
            <span className='reviewinfo'><span className='reviewinfo'>{formatDate(review.timestamp)}</span> | <Link className="reviewitems" to={`/profile/${review.userProfile.profilename}`}>{review.userProfile.profilename}</Link></span> <br />
            <span className='userinfo'>{review.review}</span> <br />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AllReviews;
