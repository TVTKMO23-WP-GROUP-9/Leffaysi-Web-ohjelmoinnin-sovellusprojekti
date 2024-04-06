const favoritelistModel = require('./favoritelistModel');

// hakee kaikki suosikkilistat
async function getAllFavoritelist (req, res)  {
    try {
      const query = 'SELECT * FROM favoritelist_';
      const favoritelist = await favoritelistModel.queryDatabase(query);
      res.json(favoritelist);
    } catch (error) {
      console.error('Virhe haettaessa Listaa:', error);
    }
  };
  
  // hakee kaikki suosikkilistat profiiliid:llä

  async function getFavoritelistByProfile(req, res) {
    
    const profileid = req.params.profileid;
    try {
        const query = {
            text: `SELECT * FROM favoritelist_ WHERE profileid = $1`,
            values: [profileid],
        };
        const result = await favoritelistModel.queryDatabase(query);
        if (result.length > 0) {
          res.json(result);
        } else {
          res.status(404).send('Tietuetta ei löytynyt');
        }
      } catch (error) {
        console.error('Virhe haettaessa tietuetta:', error);
        res.status(500).send('Virhe haettaessa tietuetta');
      }
    }
    

//hakee kaikki suosikkilistat groupid:llä
async function getFavoritelistByGroup(req, res) {
  const groupid = req.params.groupid;
  try {
      const query = {
          text: `SELECT * FROM favoritelist_ WHERE groupid = $1`,
          values: [groupid],
      };
      const result = await favoritelistModel.queryDatabase(query);
      if (result.length > 0) {
        res.json(result);
      } else {
        res.status(404).send('Tietuetta ei löytynyt');
      }
    } catch (error) {
      console.error('Virhe haettaessa tietuetta:', error);
      res.status(500).send('Virhe haettaessa tietuetta');
    }
  }

  //lisää uuden suosikkilistan profiiliin tai grouppiin
  async function createFavoritelist(req, res) {
    const { favoriteditem, showtime, groupid, profileid } = req.body;
    try {
        const now = new Date();
        let favoritelistQuery;
        if (groupid) {
            favoritelistQuery = {
                text: 'INSERT INTO favoritelist_ (groupid, favoriteditem, showtime, timestamp) VALUES ($1, $2, $3, $4)',
                values: [groupid, favoriteditem, showtime, now],
                
            };
            
        } else if (profileid) {
            favoritelistQuery = {
                text: 'INSERT INTO favoritelist_ (profileid, favoriteditem, showtime, timestamp) VALUES ($1, $2, $3, $4)',
                values: [profileid, favoriteditem, showtime, now],
            };
        } 
        await favoritelistModel.queryDatabase(favoritelistQuery);
        res.status(201).send('Suosikkilista lisätty onnistuneesti');
    } catch (error) {
        console.error('Virhe lisättäessä suosikkilistaa:', error);
    }
}
  
    async function deleteFavoritelist(req, res) {
      const idfavoritelist = req.params.idfavoritelist;
      try {
        const query = {
          text: 'DELETE FROM favoritelist_ WHERE idfavoritelist = $1',
          values: [idfavoritelist],
        };
    
        const result = await favoritelistModel.queryDatabase(query);
          res.send(`Lista poistettu onnistuneesti`);
      } catch (error) {
        console.error('Virhe poistettaessa listaa:', error);
        res.status(500).send('Virhe poistettaessa listaa');
      }
    };
    
  
  module.exports = {
    getAllFavoritelist,
    createFavoritelist,
    deleteFavoritelist,
    getFavoritelistByProfile,
    getFavoritelistByGroup,
  };