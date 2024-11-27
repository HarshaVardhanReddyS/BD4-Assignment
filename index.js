const express = require('express');
const { resolve } = require('path');
const cors = require('cors');
const { open } = require('sqlite');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3010;

app.use(express.static('static'));
app.use(cors());
app.use(express.json());

let db;

(async () => {
  db = await open({
    filename: './db/database.sqlite',
    driver: sqlite3.Database,
  });
})();


async function fetchAllRestaurants() {
  let query = 'SELECT * FROM restaurants';
  let response = await db.all(query, []);

  return { restaurents: response };
}

// console.log(fetchAllMovies());

app.get('/restaurants', async (req, res) => {
  let results = await fetchAllRestaurants();
  console.log(res.statusCode);
  res.status(200).json(results);
});

async function getRestaurantsByID(id) {
  let query = 'SELECT * FROM restaurants WHERE id = ?';
  let response = await db.all(query, [id]);

  return { restaurant: response };
}

app.get('/restaurants/details/:id', async (req, res) => {
  let id = req.params.id;
  let restaurantsById = await getRestaurantsByID(id);

  res.status(200).json(restaurantsById);
});

async function getRestaurantsByCuisine(cuisine) {
  let query = 'SELECT * FROM restaurants WHERE cuisine = ?';
  let response = await db.all(query, [cuisine]);

  return { restaurants: response };
}

app.get('/restaurants/cuisine/:cuisine', async (req, res) => {
  let cuisine = req.params.cuisine;
  let restaurantsByCuisine = await getRestaurantsByCuisine(cuisine);

  res.status(200).json(restaurantsByCuisine);
});

async function getRestaurantsByFilter(type, seating, status) {
  let query =
    'SELECT * FROM restaurants WHERE isVeg = ? AND hasOutdoorSeating = ? AND isLuxury = ?';
  let response = await db.all(query, [type, seating, status]);

  return { restaurants: response };
}

app.get('/restaurants/filter', async (req, res) => {
  let type = req.query.isVeg;
  let seating = req.query.hasOutdoorSeating;
  let status = req.query.isLuxury;
  console.log(type, seating, status);
  let restaurantsFilter = await getRestaurantsByFilter(type, seating, status);

  res.status(200).json(restaurantsFilter);
});

async function getRestaurantsByRating() {
  let query = 'SELECT * FROM restaurants ORDER BY rating DESC';
  let response = await db.all(query, []);

  return { restaurants: response };
}

app.get('/restaurants/rating/', async (req, res) => {
  let restaurantsByRating = await getRestaurantsByRating();

  res.status(200).json(restaurantsByRating);
});

async function getDishes() {
  let query = 'SELECT * FROM dishes';
  let response = await db.all(query, []);

  return { dishes: response };
}

app.get('/dishes/', async (req, res) => {
  let dishes = await getDishes();

  res.status(200).json(dishes);
});

async function getDishesByid(id) {
  let query = 'SELECT * FROM dishes WHERE id = ?';
  let response = await db.all(query, [id]);

  return { dishes: response };
}

app.get('/dishes/details/:id', async (req, res) => {
  let id = req.params.id;
  let dishes = await getDishesByid(id);

  res.status(200).json(dishes);
});

async function getDishesByType(type) {
  let query = 'SELECT * FROM dishes WHERE isVeg = ?';
  let response = await db.all(query, [type]);

  return { dishes: response };
}

app.get('/dishes/filter', async (req, res) => {
  let type = req.query.isVeg;
  let dishes = await getDishesByType(type);

  res.status(200).json(dishes);
});

async function getDishesByPricing() {
  let query = 'SELECT * FROM dishes ORDER BY price';
  let response = await db.all(query, []);

  return { dishes: response };
}

app.get('/dishes/sort-by-price', async (req, res) => {
  let dishes = await getDishesByPricing();

  res.status(200).json(dishes);
});

app.get('/', (req, res) => {
  // console.log(db);
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
