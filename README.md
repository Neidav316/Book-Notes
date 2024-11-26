# BookNotes Web App
BookNotes is a web application that helps users keep track of books they have read and take detailed notes about them. The app utilizes the OpenLibrary API for searching books and fetching book covers, while a PostgreSQL server is used to store the user's books and notes.

## Preview
<img src="/public/assets/book-notes-preview.gif" width="40" height="40">

## Features
Book Search: Search for books by title, author, or ISBN using the OpenLibrary API.
Book Covers: Display visually appealing book covers using the OpenLibrary cover API.
Note Management: Add, view, and edit notes for each book in your collection.
Book Storage: Save your favorite books to a PostgreSQL database for persistent access.
Clean UI: Intuitive interface for managing your reading list and notes.

## Tech Stack
Frontend: HTML, CSS, JavaScript, EJS for dynamic rendering.
Backend: Node.js, Express.js.
Database: PostgreSQL for storing book and note data.
API Integration: OpenLibrary API for book information and covers.

## Setup Instructions
### Prerequisites
Node.js: Ensure you have Node.js installed. Download Node.js
PostgreSQL: Install PostgreSQL on your system. Download PostgreSQL
### Installation
1. Clone the repository:

```bash
git clone https://github.com/your-username/booknotes-webapp.git
cd booknotes-webapp
```
2. Install dependencies:
```bash
npm install
```
3. Set up the PostgreSQL database:
    - Create a new database (e.g., booknotes_db).
    - Run the provided SQL schema file to create the necessary tables (e.g., books and notes):
```sql
Copy code
CREATE TABLE books (
  id SERIAL PRIMARY KEY,
  title VARCHAR(50) NOT NULL,
  author VARCHAR(50) NOT NULL,
  cover_i VARCHAR(15)
);

CREATE TABLE notes (
  id SERIAL PRIMARY KEY,
  book_id INT REFERENCES books(id),
  content TEXT
);
```
4. Configure environment variables:

    - Create a .env file in the project root and add the following:
```env
DATABASE_URL=postgresql://username:password@localhost:5432/booknotes_db
OPENLIBRARY_API_URL=https://openlibrary.org
```
5. Start the server:

```bash
npm start
```
6. Open your browser and navigate to http://localhost:3000.
## Usage
1. Search for Books:

    - Use the search bar to find books by title.
    - Click on a book to save it to your library.
2. Add Notes:

    - Select a book from your library to view or add notes about it.
    - Notes are saved to the PostgreSQL database for future reference.
3. Manage Your Library:

    - Access your saved books from the "Library" section.
    - Edit or delete notes as needed.

## API Reference
### OpenLibrary API
- Search Books:
Endpoint: https://openlibrary.org/search.json?q=<search-term>
Returns search results based on the query.

- Book Covers:
Endpoint: https://covers.openlibrary.org/b/id/<cover-id>-L.jpg
Fetches a book cover by its ID.

## Future Enhancements
- User Authentication: Allow users to create accounts and have personalized libraries.
- Tags and Categories: Enable categorization of books and notes for better organization.
- Mobile Support: Improve responsiveness for mobile devices.
- Export Notes: Allow users to export notes as PDF or text files.

## Acknowledgments
- OpenLibrary API: For providing access to book data and covers.[link](https://openlibrary.org/)
- PostgreSQL: For reliable and scalable database support.
