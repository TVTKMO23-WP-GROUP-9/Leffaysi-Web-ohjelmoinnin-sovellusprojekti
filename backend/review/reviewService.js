const reviewModel = require('./reviewModel');

async function getAllReviews(req, res) {
  try {
    const reviews = await reviewModel.getAllReviews();
    res.json(reviews);
  } catch (error) {
    console.error('Virhe haettaessa arvosteluja:', error);
    res.status(500).send('Virhe haettaessa arvosteluja');
  }
}

async function getReviewById(req, res) {
  const id = req.params.id;
  try {
    const review = await reviewModel.getReviewById(id);
    if (review) {
      res.json(review);
    } else {
      res.status(404).send('Arvostelua ei löytynyt');
    }
  } catch (error) {
    console.error('Virhe haettaessa arvostelua:', error);
    res.status(500).send('Virhe haettaessa arvostelua');
  }
}

async function createReview(req, res) {
  const { user_id, product_id, rating, comment, date_posted } = req.body;
  try {
    await reviewModel.createReview(user_id, product_id, rating, comment, date_posted);
    res.status(201).send('Arvostelu lisätty onnistuneesti');
  } catch (error) {
    console.error('Virhe luotaessa arvostelua:', error);
    res.status(500).send('Virhe luotaessa arvostelua');
  }
}

async function updateReview(req, res) {
  const id = req.params.id;
  const { user_id, product_id, rating, comment, date_posted } = req.body;
  try {
    await reviewModel.updateReview(id, user_id, product_id, rating, comment, date_posted);
    res.send('Arvostelu päivitetty onnistuneesti');
  } catch (error) {
    console.error('Virhe päivitettäessä arvostelua:', error);
    res.status(500).send('Virhe päivitettäessä arvostelua');
  }
}

async function deleteReview(req, res) {
  const id = req.params.id;
  try {
    await reviewModel.deleteReview(id);
    res.send('Arvostelu poistettu onnistuneesti');
  } catch (error) {
    console.error('Virhe poistettaessa arvostelua:', error);
    res.status(500).send('Virhe poistettaessa arvostelua');
  }
}

module.exports = {
  getAllReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
};
