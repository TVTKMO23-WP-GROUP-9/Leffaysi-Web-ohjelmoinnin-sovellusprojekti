import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Homepage.css'; // Sisällytä CSS-tiedosto suoraan komponenttiin

const Latestreviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get('http://localhost:3001/review/new');
        const reviewData = response.data;
        
        // Hae jokaisen arvostelun review.revieweditem arvolla liittyvä elokuva
        const reviewsWithMovies = await Promise.all(reviewData.map(async review => {
          try {
            let responseData;
            if (review.mediatype === 0) {
              const movieResponse = await axios.get(`http://localhost:3001/movie/${encodeURIComponent(review.revieweditem)}`);
              responseData = movieResponse.data;
            } else if (review.mediatype === 1) {
              const tvResponse = await axios.get(`http://localhost:3001/series/${encodeURIComponent(review.revieweditem)}`);
              responseData = tvResponse.data;
            }
            return {
              ...review,
              data: responseData
            };
          } catch (error) {
            console.error('Virhe tiedon hakemisessa:', error);
            // Palauta tyhjä objekti, jos hakeminen epäonnistuu
            return {};
          }
        }));
        
        // Suodata pois tyhjät arvostelut ja aseta arvostelut
        setReviews(reviewsWithMovies.filter(review => Object.keys(review).length !== 0));
        setLoading(false);
      } catch (error) {
        console.error('Virhe haettaessa arvosteluja:', error);
        setLoading(false);
      }
    };
  
    fetchReviews();
  }, []);
  


  return (
    <>
      {loading ? (
        <p>Ladataan arvosteluja...</p>
      ) : (
        <div className="reviewmain">
          {reviews.map((review, index) => (
            <table className="review-item" key={index}>
              <tbody>
                <tr>
                <td className='tdimg'>
                {review.mediatype === 0 ? (
                <Link to={`/movie/${review.revieweditem}`} className="link-style">
                <img src={`https://image.tmdb.org/t/p/w342${review.data.poster_path}`} alt={review.data.title} />
                <div>             
                  {[...Array(review.rating)].map((_, i) => (
                    <span key={i} >&#11088;</span>
                  ))}
                  {[...Array(5 - review.rating)].map((_, i) => (
                    <span key={i + review.rating}>&#x2605;</span>
                  ))}
                  </div>
                  </Link>
                  ) : (
                  <Link to={`/series/${review.revieweditem}`} className="link-style">
                  <img src={`https://image.tmdb.org/t/p/w342${review.data.poster_path}`} alt={review.data.title} />
                  <div>             
                  {[...Array(review.rating)].map((_, i) => (
                    <span key={i} >&#11088;</span>
                  ))}
                  {[...Array(5 - review.rating)].map((_, i) => (
                    <span key={i + review.rating}>&#x2605;</span>
                  ))}
                  </div>
                  </Link>
                  )}
                  </td>
                  <td>

                  </td>
                  <td className="review-info">
                    <h2>{review.data.title}</h2>
                    <p><b>Arvostelu: </b> {review.review}</p>
                    <p><b>Arvosteltu: </b>{new Date(review.timestamp).toLocaleString('fi-FI', {
                      day: 'numeric',
                      month: 'numeric',
                      year: 'numeric',
                      hour: 'numeric',
                      minute: 'numeric',
                    })}</p>
                    <p><b>Arvostelija: </b> {review.profilename}</p>
                  </td>
                </tr>
              </tbody>
            </table>
          ))}
        </div>
      )}
    </>
  );  
};

export default Latestreviews;
