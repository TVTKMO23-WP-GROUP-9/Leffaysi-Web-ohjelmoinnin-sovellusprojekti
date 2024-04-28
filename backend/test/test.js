// test/authRoutes.test.js
require('dotenv').config({ path: '../.env.test' });
const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const authService = require('../auth/authService');
const profileModel = require('../profile/profileModel'); 

chai.use(chaiHttp);
const expect = chai.expect;

describe('Authentication API', () => {
  describe('User Registration', () => {
    it('should register a new user', async () => {
      const res = await chai
        .request(server)
        .post('/auth/register')
        .send({ username: 'testuser2', password: 'testpassword', email: 'test@example.com' })
        .timeout(10000); 
    
      expect(res).to.have.status(201);
      expect(res.body).to.have.property('message').equal('Rekisteröinti onnistui');
    });

    it('should return an error if username is already taken', async () => {
      const res = await chai
        .request(server)
        .post('/auth/register')
        .send({ username: 'testuser2', password: 'testpassword', email: 'test@example.com' });

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('message').equal('Käyttäjätunnus varattu');
    });
  });

  describe('User Login', () => {
    it('should login an existing user', async () => {
      const res = await chai
        .request(server)
        .post('/auth/login')
        .send({ username: 'testuser2', password: 'testpassword' });

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('jwtToken');
    });

    it('should return an error if username or password is incorrect', async () => {
      const res = await chai
        .request(server)
        .post('/auth/login')
        .send({ username: 'wrongusername', password: 'wrongpassword' });

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('message').equal('Käyttäjätunnusta ei löydy');
    });
  });

  describe('User Deletion', () => {
    let token; 
  
    before(async () => {
      const res = await chai
        .request(server)
        .post('/auth/login')
        .send({ username: 'testuser2', password: 'testpassword' });
  
      token = res.body.jwtToken;
    });
  
    it('should delete an existing user profile', async () => {
      const res = await chai
        .request(server)
        .delete('/profile')
        .set('Authorization', `Bearer ${token}`); 
  
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('message').equal('Tietue poistettu onnistuneesti');
    });
  });

  
});