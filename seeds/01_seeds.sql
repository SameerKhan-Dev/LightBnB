/*
  Write INSERT Queries to add data to all of the tables.
*/

/*
  Insert example data into the users table.
*/
DELETE FROM users;
DELETE FROM properties;
DELETE FROM reservations;


INSERT INTO users (name, email, password)
VALUES ('Eva Stanley', 'sebastianguerra@ymail.com','$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Louisa Meyer', ' jacksonrose@hotmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.'),
('Dominic Parks', 'victoriablackwell@outlook.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u.');

/*
  Insert example data into the properties table.
*/

INSERT INTO properties (owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES (1,'Speed Lamp','description', 'https://images.pexels.com/photos/2086676/pexels-photp=','https://images.pexels.com/photos/-eererere', 930.61, 6,4,8,'Canada','536 Namsun Highway','Sotboske','Quebec', 28142, true ),
(2,'Blank corner','description', 'https://images.pexels.com/photos/2086676/pexels-photp=','https://images.pexels.com/photos/-eererere', 940.61, 7,5,9,'Canada','636 Namsun Highway','Sotboske','Quebec', 29142, true ),
(3,'Habit mix','description', 'https://images.pexels.com/photos/2086676/pexels-photp=','https://images.pexels.com/photos/-eererere', 1042.61, 11,2,33,'Canada','736 Namsun Highway','Sotboske','Quebec', 30142, true );


/*
  Insert example data into the reservations table.
*/

INSERT INTO reservations (start_date, end_date, property_id, guest_id)
VALUES ('2018-09-11', '2018-09-26', 2,3),
('2019-01-04', '2019-02-01', 2,2),
('2021-10-01', '2021-10-14', 1,3);


/*
  Insert example data into the property_reviews table.
*/
INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (2,3,1,3,'messages1'),
(1,2,3,4,'messages2'),
(3,1,2,5,'messages3');