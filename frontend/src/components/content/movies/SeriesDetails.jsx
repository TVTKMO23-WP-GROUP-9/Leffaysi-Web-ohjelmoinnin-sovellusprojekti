import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';

const SeriesDetails = () => {
    const { id } = useParams(); 
    const [series, setSeries] = useState(null); 

    useEffect(() => {
      const fetchSeries = async () => {
        try {
          const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/series/${id}`);
          setSeries (response.data);
        } catch (error) {
          console.error('Hakuvirhe', error);
        }
      };

      fetchSeries();
      
      return () => setSeries(null);
    }, [id]);


    return (
        <div id="backdrop" style={series && { backgroundImage: `url(https://image.tmdb.org/t/p/original${series.backdrop_path})`, backgroundSize: 'cover' }}>
            <div className="content">
  
              {series && (
              <div id="backdropbg">
      
                <div className="moviemain">
                  <img className="posterimg" src={`https://image.tmdb.org/t/p/w342${series.poster_path}`} alt={series.title} />
  
                  <div className="movieinfo">
  
                    <h2>{series.name}</h2>
                    <p><b>Kuvaus:</b> {series.overview}</p>
                    <p><b>Kesto:</b> {series.episode_run_time.map(time => `${time}`).join('-')} min / per jakso</p>
                    <p><b>Genre:</b> {series.genres.map(genre => genre.name).join(', ')}</p>
                    <p><b>Julkaistu:</b> {series.first_air_date}</p>
                    <p><b>Tuotantoyhtiöt:</b> {series.production_companies.map(company => company.name).join(', ')}</p>
                    <p><b>Kerännyt ääniä:</b> {series.vote_count}</p>
                    <p><b>Äänten keskiarvo:</b> {series.vote_average} / 10 </p>
                  
                </div>
              </div>
  
              <div className="moviereviews">
                <h2>Viimeisimmät arvostelut</h2>
  
                  <div className="reviewslisted">
                    <b>Lähetetty:</b> 00.00.2024 <br/>
                    <b>Käyttäjältä:</b> <i>Anonymous</i> <br/>
                    <b>Arvio:</b> &#11088;&#11088;&#11088;&#11088;&#11088; [5/5] tähteä <br/>
                    <b>Perustelut:</b> <br/>
                    Esimerkkiarvostelu, tämä on placeholder vaikkapa. Ihan kiva sarja ois, jos katsoa ehtis. Kaikki aika katoaa nykyään johonkin. Epäoleelliseen? 
                    Ehkä ei kuitenkaan. Annan silti runsaat viisi tähteä, koska voin. Koska tämähän oli vain.. esimerkki yhdestä arvostelusta?<br/><br/>
                  </div>
  
                </div>
  
                <div className="justMargins">
                <Link to="/search">Tee uusi haku</Link> 
                </div>
  
              </div>
            )}
          </div>
        </div>
      );
  };

export default SeriesDetails;