import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Login from './Login';

const Header = ({ user, setUser, handleLogout}) => {
  const [isburgerOpen, setIsburgerOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const toggleburger = () => {
    setIsburgerOpen(!isburgerOpen);
  };

  const toggleLogin = () => {
    setShowLogin(!showLogin);
  };

  return (
    <div id="header">
      <div id="header-bar">
        <div className="header-container">
          <h2><Link className="mobile-menu-icon" onClick={toggleburger}>☰</Link></h2>
          <Link to="/"><span className="logo"></span></Link>

          <div className={`burger-items ${isburgerOpen ? 'open' : ''}`}>
            <ul className="sideLinks">
              <li><Link to="/">Etusivu</Link></li>
              <li><Link to="/search">Leffahaku</Link></li>
              <li><Link to="/search">Näytösajat</Link></li>
              <li><Link to="/community">Yhteisö</Link></li>
              <li><Link to="/about">FAQ</Link></li>
              
              <br/><br/>
              {user && <li>Kirjautunut:</li>} 
              {user && <li>{user.user}</li> } <br/>

              {user && <li><Link to="/myaccount">Oma profiili</Link></li>}
              {user && <li><Link to="/myaccount">Tilinhallinta</Link></li>}
              {user && <li className="lilogin"><Link onClick={handleLogout}>Kirjaudu ulos</Link></li>}
            </ul>
          </div>

          <div className="menu-items">
            <div className="menu-items-left">
              <ul className="whiteLinks">
                <li><Link to="/search">Leffat ja sarjat</Link></li>
                <li><Link to="/community">Yhteisö</Link></li>
              </ul>
            </div>

            <ul className="menu-items-right whiteLinks">
              {!user && <li className="lilogin"><Link onClick={toggleLogin}>Kirjautuminen</Link></li>}
              {!user && showLogin && <Login setUser={setUser} />}
              {user && <li>{user.user} :</li> }
               {user &&<li><Link to="/myaccount">Profiili</Link></li>}
              {user && <li><Link to="/myaccount">Oma tili</Link></li>}
              {user && <li className="lilogin"><Link onClick={handleLogout}>Kirjaudu ulos</Link></li>}
            </ul>
          </div>
        </div>
        </div>
        <LoginDropdown />
      </div>
  );
};

export default Header;