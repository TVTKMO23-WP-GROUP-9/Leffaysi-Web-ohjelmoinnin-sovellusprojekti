import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { jwtToken, usertype } from '../auth/authSignal';
const { VITE_APP_BACKEND_URL } = import.meta.env;


export default function Login({ setUser, window, fullpage }) {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [messageLogin, setMessageLogin] = useState('');
  const [messageRegister, setMessageRegister] = useState('');

  const [formData, setFormData] = useState({
    profilename: null,
    email: null,
    password: null
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${VITE_APP_BACKEND_URL}/auth/login`, {
        username: username,
        password: password
      });

      if (response.status === 200) {
        jwtToken.value = response.data.jwtToken;
        usertype.value = response.data.usertype;
        console.log('userType:', usertype.value);
        setUser({ user: username, usertype: usertype.value });
        navigate('/myaccount');
        //setShowLogin(!showLogin);
      }
    } catch (error) {
      console.error('Kirjautumisvirhe:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    const profilename = formData.profilename;
    const password = formData.password;
    const email = formData.email;
    try {
      const response = await axios.post(`${VITE_APP_BACKEND_URL}/auth/register`, {
        username: profilename,
        password: password,
        email: email
      });

      if (response.status === 201) {
        setMessageRegister('Rekisteröinti onnistui, voit nyt kirjautua sisään');
        setTimeout(() => {
          setMessageRegister('');
        }, 3000);
        setShowRegisterForm(false);
        setUsername(profilename);
        setPassword(password);
      }

    } catch (error) {
      console.error('Virhe käyttäjän luomisessa:', error);
      if (error.response.status === 400) {
        setMessageRegister('Tarkista antamasi tiedot ja yritä uudelleen');
        setTimeout(() => {
          setMessageRegister('');
        }, 3000);
      } else if (error.response.status === 500) {
        setMessageRegister('Rekisteröinti epäonnistui, yritä uudelleen');
        setTimeout(() => {
          setMessageRegister('');
        }, 3000);
      }
    }
  };

  const handleToggleRegisterForm = () => {
    setShowRegisterForm(!showRegisterForm);
  };

  const handleToggleForgotPasswordForm = () => {
    setShowForgotPassword(!showForgotPassword);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      // Tarkistetaan, onko sähköposti olemassa järjestelmässä
      const response = await axios.post(`${VITE_APP_BACKEND_URL}/auth/forgot-password`, { email });

      if (response.status === 200) {
        alert('Uusi salasana on lähetetty sähköpostiisi.');
        setShowForgotPassword(false);
      }
    } catch (error) {
      console.error('Virhe unohtuneen salasanan käsittelyssä:', error);
      alert('Sähköpostiosoitetta ei löytynyt. Tarkista antamasi sähköpostiosoite.');
    }
  };

  if (window) {
    return (
      <div className="login-window">
        {showRegisterForm ? (
          <form onSubmit={handleRegister}>
            <input className="field" type="text" name="profilename" value={formData.profilename || null} onChange={handleChange} placeholder="Käyttäjänimi" /><br />
            <input className="field" type='email' name="email" value={formData.email || null} onChange={handleChange} placeholder="Sähköposti" /><br />
            <input className="field" type='password' name="password" value={formData.password || null} onChange={handleChange} placeholder="Salasana" /><br />
            <button className="formButton" type="submit">Rekisteröidy</button>
            <button className="formButton" type="button" onClick={handleToggleRegisterForm}>Peruuta</button>
          </form>
        ) : showForgotPassword ? (
          <form onSubmit={handleForgotPassword}>
            <input className="field" type="email" name="email" value={email} onChange={handleEmailChange} placeholder="Sähköpostiosoite" required />
            <button className="formButton" type="submit">Palauta salasana</button>
            <button className="formButton" onClick={handleToggleForgotPasswordForm}>Peruuta</button>
          </form>
        ) : (
          <form onSubmit={handleLogin}>
            <input className="field" value={username} onChange={e => setUsername(e.target.value)} placeholder="Käyttäjänimi"></input>
            <input className="field" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Salasana"></input>
            <button className="formButton" type="submit">Kirjaudu sisään</button>
            <hr />

              <button className="formButton" onClick={handleToggleRegisterForm}>Rekisteröidy</button>
              
              <button className="formButton" onClick={handleToggleForgotPasswordForm}>Unohtuiko salasana?</button> 

          </form>

        )}
        
        <div className='lilInfoBox'>{messageRegister && <span className='login-window-info'>{messageRegister}</span>}</div>
      </div>
    );
  } else {
    return (
      <div className='content'>

        <div className="login-view">
          <h2>Kirjautuminen</h2>
          <div className="full-page">
            <span className="userinfo">Älä koskaan jaa käyttäjätunnustasi ja salasanaasi muille</span><br /><br />

            <form onSubmit={handleLogin}>
              Käyttäjätunnus: <br />
              <input className="field" value={username} onChange={e => setUsername(e.target.value)} placeholder="Käyttäjänimi"></input>
              <br /><br />
              Salasana: <br />
              <input className="field" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Salasana"></input> <br />
              <button className="basicbutton" type="submit">Kirjaudu sisään</button>
            </form>
          </div>
        </div>

        <div className="login-view">
          <h2>Unohtuiko salasana?</h2>
          <div className="full-page">
            <span className="userinfo">Syötä sähköpostiosoitteesi, niin lähetämme sinulle uuden salasanan.</span>
            <form onSubmit={handleForgotPassword}>
              <input type="email" value={email} onChange={handleEmailChange} placeholder="Sähköpostiosoite" required /> <br />
              <button className="basicbutton" type="submit">Palauta salasana</button>
            </form>
          </div>
        </div>

        <div className="login-view">
          <h2>Rekisteröidy käyttäjäksi</h2>
          <div className="full-page">
            <div className='form-view'>
              <form onSubmit={handleRegister}>
                <span className="userinfo">Kaikki kentät ovat pakollisia, sähköposti ei saa olla jo käytössä jollain käyttäjällä.</span> <br/><br/>
                <b>Käyttäjänimi</b> <br />
                <input className="field" type="text" name="profilename" value={formData.profilename || null} onChange={handleChange} /><br />
                <b>Sähköposti</b><br />
                <input className="field" type='text' name="email" value={formData.email || null} onChange={handleChange} /><br />
                <b>Salasana</b><br />
                <input className="field" type='password' name="password" value={formData.password || null} onChange={handleChange} /><br />
                <button className="basicbutton" type="submit">Rekisteröidy</button> <br/>
                {messageRegister && <span className='communityinfo'>{messageRegister}</span>}
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}