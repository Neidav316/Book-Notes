CREATE TABLE notes (
	id SERIAL PRIMARY KEY,
	note TEXT NOT NULL,
	book_id INT REFERENCES books(id)
);

CREATE TABLE books (
	id SERIAL PRIMARY KEY,
	book_name VARCHAR(50) NOT NULL,
	author VARCHAR(50) NOT NULL,
    cover_i VARCHAR(15)
);