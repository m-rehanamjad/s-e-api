const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Sample books data
const books = [
  {
    id: 1,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    genre: "Fiction",
    year: 1960,
    isbn: "978-0-06-112008-4",
    pages: 281,
    description: "A classic novel about racial injustice in the American South"
  },
  {
    id: 2,
    title: "1984",
    author: "George Orwell",
    genre: "Dystopian Fiction",
    year: 1949,
    isbn: "978-0-452-28423-4",
    pages: 328,
    description: "A dystopian social science fiction novel and cautionary tale"
  },
  {
    id: 3,
    title: "Pride and Prejudice",
    author: "Jane Austen",
    genre: "Romance",
    year: 1813,
    isbn: "978-0-14-143951-8",
    pages: 432,
    description: "A romantic novel following Elizabeth Bennet and Mr. Darcy"
  },
  {
    id: 4,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    genre: "Fiction",
    year: 1925,
    isbn: "978-0-7432-7356-5",
    pages: 180,
    description: "A tale of the Jazz Age and the American Dream"
  },
  {
    id: 5,
    title: "The Catcher in the Rye",
    author: "J.D. Salinger",
    genre: "Fiction",
    year: 1951,
    isbn: "978-0-316-76948-0",
    pages: 277,
    description: "A coming-of-age story about teenage rebellion"
  },
  {
    id: 6,
    title: "Dune",
    author: "Frank Herbert",
    genre: "Science Fiction",
    year: 1965,
    isbn: "978-0-441-17271-9",
    pages: 688,
    description: "Epic science fiction novel set on the desert planet Arrakis"
  },
  {
    id: 7,
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    genre: "Fantasy",
    year: 1937,
    isbn: "978-0-547-92822-7",
    pages: 366,
    description: "A fantasy adventure following Bilbo Baggins"
  },
  {
    id: 8,
    title: "Harry Potter and the Philosopher's Stone",
    author: "J.K. Rowling",
    genre: "Fantasy",
    year: 1997,
    isbn: "978-0-7475-3269-9",
    pages: 223,
    description: "The first book in the Harry Potter series"
  }
];

// Helper function to find book by ID
const findBookById = (id) => books.find(book => book.id === parseInt(id));

// Routes

// Get all books
app.get('/api/books', (req, res) => {
  const { genre, author, year } = req.query;
  let filteredBooks = books;

  // Filter by genre if provided
  if (genre) {
    filteredBooks = filteredBooks.filter(book => 
      book.genre.toLowerCase().includes(genre.toLowerCase())
    );
  }

  // Filter by author if provided
  if (author) {
    filteredBooks = filteredBooks.filter(book => 
      book.author.toLowerCase().includes(author.toLowerCase())
    );
  }

  // Filter by year if provided
  if (year) {
    filteredBooks = filteredBooks.filter(book => 
      book.year === parseInt(year)
    );
  }

  res.json({
    books: filteredBooks,
    total: filteredBooks.length
  });
});

// Get book by ID
app.get('/api/books/:id', (req, res) => {
  const book = findBookById(req.params.id);
  
  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }
  
  res.json(book);
});

// Get books by genre
app.get('/api/books/genre/:genre', (req, res) => {
  const genre = req.params.genre;
  const booksByGenre = books.filter(book => 
    book.genre.toLowerCase() === genre.toLowerCase()
  );
  
  if (booksByGenre.length === 0) {
    return res.status(404).json({ error: 'No books found for this genre' });
  }
  
  res.json({
    genre: genre,
    books: booksByGenre,
    total: booksByGenre.length
  });
});

// Get books by author
app.get('/api/books/author/:author', (req, res) => {
  const author = req.params.author;
  const booksByAuthor = books.filter(book => 
    book.author.toLowerCase().includes(author.toLowerCase())
  );
  
  if (booksByAuthor.length === 0) {
    return res.status(404).json({ error: 'No books found for this author' });
  }
  
  res.json({
    author: author,
    books: booksByAuthor,
    total: booksByAuthor.length
  });
});

// Get random book
app.get('/api/books/random', (req, res) => {
  const randomIndex = Math.floor(Math.random() * books.length);
  const randomBook = books[randomIndex];
  
  res.json(randomBook);
});

// Search books by title
app.get('/api/books/search/:title', (req, res) => {
  const title = req.params.title;
  const searchResults = books.filter(book => 
    book.title.toLowerCase().includes(title.toLowerCase())
  );
  
  if (searchResults.length === 0) {
    return res.status(404).json({ error: 'No books found matching the title' });
  }
  
  res.json({
    searchTerm: title,
    books: searchResults,
    total: searchResults.length
  });
});

// Get available genres
app.get('/api/genres', (req, res) => {
  const genres = [...new Set(books.map(book => book.genre))];
  
  res.json({
    genres: genres,
    total: genres.length
  });
});

// Get available authors
app.get('/api/authors', (req, res) => {
  const authors = [...new Set(books.map(book => book.author))];
  
  res.json({
    authors: authors,
    total: authors.length
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    totalBooks: books.length
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Books API running on port ${PORT}`);
  console.log(`Try: http://localhost:${PORT}/api/books`);
});

module.exports = app;