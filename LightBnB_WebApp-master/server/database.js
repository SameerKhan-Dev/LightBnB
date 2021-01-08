const properties = require('./json/properties.json');
const users = require('./json/users.json');

const { Client } = require('pg');
const { rows } = require('pg/lib/defaults');

const pool = new Client( {
  user: 'vagrant',
  password: '123',
  host:'localhost',
  database:'lightbnb'
});

pool.connect().then(console.log("connected!")).catch(err => console.log("error on connection", err));
/*
pool.query(`
  SELECT * FROM properties
  LIMIT 10;
  `)
  .then(res => { 
    console.log(res);
    //console.log(res.rows);
    return res.rows}).catch(err => console.log("Error is: " , err));
*/
/*
const getAllProperties = function(options, limit = 10) {
  console.log("Hello");
  return pool.query(`
  SELECT * FROM properties
  LIMIT $1
  `, [limit])
  .then(res => { 
    //console.log(res);
    //console.log(res.rows);
    return res.rows});
}
*/
const getAllProperties = function(options, limit = 10) {
  //console.log("Hello");

  const queryParams = [];

  let queryString = `
  
    SELECT properties.*, AVG(property_reviews.rating) as average_rating 
    FROM properties
    JOIN property_reviews ON properties.id = property_id
  `;

  /////////
  if(options.city) {
    queryParams.push(`%${options.city}%`);

    queryString += `WHERE city LIKE $${queryParams.length}`
    
  }
  ////////
  if(options.owner_id) {

    queryParams.push(options.owner_id);

    if(queryParams.length === 0 ) {

      queryString += `WHERE owner_id = $${queryParams.length}`

    } else {
  
      queryString += ` AND owner_id = $${queryParams.length}`
    }
    
  }

  ////////
  if(options.minimum_price_per_night) {

    queryParams.push(options.minimum_price_per_night);

    if(queryParams.length === 1 ) {

      queryString += `WHERE cost_per_night >= $${queryParams.length}`

    } else {
  
      queryString += ` AND cost_per_night >= $${queryParams.length}`
    }
  }

  if(options.maximum_price_per_night) {

    queryParams.push(options.maximum_price_per_night);

    if(queryParams.length === 1 ) {

      queryString += `WHERE cost_per_night <= $${queryParams.length}`

    } else {
  
      queryString += ` AND cost_per_night <= $${queryParams.length}`
    }

  }

  if(options.minimum_rating) {

    queryParams.push(options.minimum_rating);

    if(queryParams.length === 1 ) {

      queryString += `WHERE rating >= $${queryParams.length}`

    } else {
  
      queryString += ` AND rating >= $${queryParams.length}`
    }

  }
  
  queryParams.push(limit);
  queryString += `   
  GROUP BY properties.id
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};`

  //console.log(queryString, queryParams);

  return pool.query(queryString, queryParams)
  .then(res => { 
    //console.log(res);
    //console.log(res.rows);
    return res.rows});
}










/// Users
/*
const getUserWithEmail = function(email) {

  pool.query(``)
  
  
  
  .then(response => {


  });

}
*/

const getUserWithEmail = function (email) {

  return pool.query(`
    SELECT * FROM users
    WHERE email = $1  
  `,[email])
  .then (response => {
    if(response){
      return response.rows[0];
    }
    return null;
  });
}
/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
/*
const getUserWithEmail = function(email) {
  let user;
  for (const userId in users) {
    user = users[userId];
    if (user.email.toLowerCase() === email.toLowerCase()) {
      break;
    } else {
      user = null;
    }
  }
  return Promise.resolve(user);
}
*/
exports.getUserWithEmail = getUserWithEmail;

const getUserWithId = function(id) {

  return pool.query(`
    SELECT * FROM users
    WHERE id = $1  
  `,[id])
  .then (response => {
    if(response){
      return response.rows[0];
    }
    return null;
  });

}

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
/*
const getUserWithId = function(id) {
  return Promise.resolve(users[id]);
}
*/
exports.getUserWithId = getUserWithId;


/*
    addUser function:
    - Accepts a user object that will have a name, email, and hashed password property.
    - This function should insert the new user into the database.
    - It will return a promise that resolves with the new user object. This object should contain the user's id after
      its been added to the database.
    - Add returning *; to the end of an INSERT query to return the objects that were inserted. This is
      handy when you need the auto-generated id of an object you've just added to the database. 
*/ 

const addUser = function(user) {

   return pool.query(`
  
    INSERT INTO users (name, email, password)
    VALUES( $1 , $2, $3)
    RETURNING *;
  `,[user.name, user.email, user.password])
    .then(response => {

      return response.rows[0];
    });
};

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
/*
const addUser =  function(user) {
  const userId = Object.keys(users).length + 1;
  user.id = userId;
  users[userId] = user;
  return Promise.resolve(user);
}
*/
exports.addUser = addUser;

/// Reservations

/*
  Update getAllReservations function to use the lightbnb database with SQL queries.

  - This function accepts a guest_id, limits the properties to 10 and returns a promise.
  - The promise should resolve reservations for that user. Use the All My Reservations query that you
   in a previous assignment. 





*/

const getAllReservations = function (guest_id, limit = 10) {

  return pool.query(`

    SELECT 
    properties.id,
    properties.owner_id,
    properties.title,
    properties.description,
    properties.thumbnail_photo_url,
    properties.cover_photo_url,
    properties.cost_per_night,
    properties.parking_spaces,
    properties.number_of_bathrooms,
    properties.number_of_bedrooms,
    properties.country,
    properties.street,
    properties.city,
    properties.post_code,
    properties.active,
    reservations.start_date, 
    reservations.end_date, 
    AVG(property_reviews.rating) as average_rating
    
    FROM properties
    JOIN reservations ON properties.id = property_id
    JOIN property_reviews ON property_reviews.property_id = properties.id
    WHERE reservations.guest_id = $1 AND 
    reservations.end_date < now()::date
    GROUP BY properties.id, reservations.id
    ORDER BY reservations.start_date ASC
    LIMIT $2;
  
  `, [guest_id, limit])
  .then(response => {
    //console.log(response.rows);
    return response.rows;
  });
}

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
/*
const getAllReservations = function(guest_id, limit = 10) {
  return getAllProperties(null, 2);
}
*/
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
/*
const getAllProperties = function(options, limit = 10) {
  const limitedProperties = {};
  for (let i = 1; i <= limit; i++) {
    limitedProperties[i] = properties[i];
  }
  console.log("limited Properties is inside getAllProperties",limitedProperties);
  return Promise.resolve(limitedProperties);
}
*/
exports.getAllProperties = getAllProperties;


/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const propertyId = Object.keys(properties).length + 1;
  property.id = propertyId;
  properties[propertyId] = property;
  return Promise.resolve(property);
}
exports.addProperty = addProperty;
