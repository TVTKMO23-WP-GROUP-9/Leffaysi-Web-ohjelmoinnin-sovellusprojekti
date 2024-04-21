import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
const { VITE_APP_BACKEND_URL } = import.meta.env;
import ReviewFormSerie from './ReviewFormSerie';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import './favoritebutton.css';
import Reviews from './Reviews';
import { getHeaders } from '@auth/token';


const SeriesDetails = ({user}) => {
  const { id} = useParams();
  const { profilename} = useParams();
  const [series, setSeries] = useState(null);
  const [providers, setProviders] = useState(null);
  const [profileid, setProfileid] = useState();
  const [isFavorite, setIsFavorite] = useState(false);
  const headers = getHeaders();

  

  useEffect(() => {
    const fetchProfile = async () => {
      try {
          const token = sessionStorage.getItem('token');
          const headers = {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
          };
          console.log("Token from sessionStorage:", token);
          console.log("Profilename from token:", user);
          const response = await axios.get(`${VITE_APP_BACKEND_URL}/profile/${user.user}`);

          console.log("Response from profile id:", response.data.profileid);

          setProfileid(response.data.profileid);

          console.log("Response from profile:", response.data);
      } catch (error) {
          console.error('Virhe haettaessa profiilitietoja:', error);
      }
  };

  fetchProfile();

    const fetchSeries = async () => {
      try {
        const response = await axios.get(`${VITE_APP_BACKEND_URL}/series/${id}`);
        setSeries(response.data);
      } catch (error) {
        console.error('Hakuvirhe', error);
      }
    };

    const fetchProviders = async () => {
      try {
        const response = await axios.get(`${VITE_APP_BACKEND_URL}/tv/provider/${id}`);
        setProviders(response.data);
      } catch (error) {
        // asetetaan providers-tila tyhjään JSON-objektiin
        setProviders({});
      }
    };


    fetchSeries();

    // Asetetaan timeout fetchProviders-funktiolle 5 sekunniksi
    const timeoutId = setTimeout(fetchProviders, 100);

    // Palautetaan poisto-funktio, joka suoritetaan komponentin purkamisen yhteydessä
    return () => clearTimeout(timeoutId);
  }, [id, user]);


// lisätään suosikkeihin sarja
console.log("profileid", profileid);
console.log("series", series);


/*useEffect(() => {
  const checkFavorite = async () => {
    try {
      const response = await axios.get(`${VITE_APP_BACKEND_URL}/favoritelist/${profileid}`, { headers });
      setIsFavorite(response.data.length > 0);
    } catch (error) {
      console.error('Virhe tarkistaessa suosikkeja:', error);
    }
  };

  checkFavorite(); 
}, [profileid]); */

const addToFavorites = async () => {
 // const profileid = res.locals.profileid;
  try {
    if (!profileid) {
      console.error('Profiili-id ei ole saatavilla');
      return;
    }
    // Haetaan käyttäjän profileid ja sen jälkeen täytetään tiedot const data
    //await axios.get(`${VITE_APP_BACKEND_URL}/profile/${profileid}`, { headers });
    if (profileid && series && typeof series.name === 'string') { 
      const data = {
        favoriteditem: series.name,
        showtime: new Date(),
        groupid: null,
        profileid: profileid,
        mediatype: 1
      };
       // lisätään tässä suosikki suosikkilistaan 
      await axios.post(`${VITE_APP_BACKEND_URL}/favoritelist`, data);

      setIsFavorite(true); 
    } else {
      console.error('Sarjaa tai profiilia ei löydy');
    }
  } catch (error) {
    console.error('JEESUSKO EI TOIMI TÄMÄ ADDTOFAVORITES', error);
  }
};

// Poistetaan suosikeista sarja EI OLE LOPULLINEN MUUTTUU VIELÄ, KOSKA EI OLE PYSTYTTY TESTAAMAAN!!!
const deleteFromFavorites = async (favoriteditem) => {
  try {
    await axios.delete(`${VITE_APP_BACKEND_URL}/favoritelist/${favoriteditem}`);

    setIsFavorite(false);
  } catch (error) {
    console.error('Virhe poistaessa suosikkia:', error);
  }
};



  return (
    <div id="backdrop" style={series && { backgroundImage: `url(https://image.tmdb.org/t/p/original${series.backdrop_path})`, backgroundSize: 'cover' }}>
      <div className="content">
        {series && (
          <div id="backdropbg">
            <div className="moviemain">
            <div style={{ position: 'relative' }}>
        <button className="favorite-button" onClick={isFavorite ? deleteFromFavorites : addToFavorites}>
        {isFavorite ? <FaHeart className="favorite-icon" size={34} /> : <FaRegHeart size={34} />}
        </button>
        <img className="poster-img" src={`https://image.tmdb.org/t/p/w342${series.poster_path}`} alt={series.title} />
      </div>
              <div className="movieinfo">

                <h2>{series.name}</h2>
                <p><b>Kuvaus:</b> {series.overview}</p>
                <p><b>Kesto:</b> {series.episode_run_time.map(time => `${time}`).join('-')} min / per jakso</p>
                <p><b>Genre:</b> {series.genres.map(genre => genre.name).join(', ')}</p>
                <p><b>Julkaistu:</b> {series.first_air_date}</p>
                <p><b>Tuotantoyhtiöt:</b> {series.production_companies.map(company => company.name).join(', ')}</p>
                <p><b>Kerännyt ääniä:</b> {series.vote_count}</p>
                <p><b>Äänten keskiarvo:</b> {series.vote_average} / 10 </p>
              <button onClick={() => deleteFromFavorites(series)}>Poista testinappi</button>
                {providers && providers.flatrate && (
                  <table className='providers'>
                    <tbody>
                      <tr>
                        <td><h3>Katso</h3></td>
                        {providers.flatrate.map(provider => (
                          <td key={provider.provider_id}>
                            <a href={`https://www.themoviedb.org/tv/${series.id}/watch`}><img src={`https://image.tmdb.org/t/p/w185${provider.logo_path}`} alt={provider.provider_name} /></a>
                          </td>
                        ))}
                      </tr>
                      <tr>
                        <td colSpan="6">
                          <a href='https://www.justwatch.com/'>Saatavuus Suomessa JustWatch</a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                )}
              </div>
            </div>

            <div className="moviereviews">

            <div><ReviewFormSerie tvShowId={id} /></div>

            <br/>
            <h2>Viimeisimmät arvostelut</h2>

            <div className="reviewslisted"><Reviews movieId={id} mediatype={1}/></div>
            </div>
            </div>
        )}
      </div>
    </div>
  );
}

export default SeriesDetails;
