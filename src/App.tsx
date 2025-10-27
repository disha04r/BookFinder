import React, { useState } from "react";
import "./App.css";

interface Book {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
}

function App() {
  const [query, setQuery] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchBooks = async () => {
    if (!query.trim()) {
      setError("Please enter a book title");
      setBooks([]);
      return;
    }

    setError("");
    setLoading(true);
    try {
      const response = await fetch(
        `https://openlibrary.org/search.json?title=${query}`
      );
      const data = await response.json();
      const booksData: Book[] = data.docs.slice(0, 10);
      setBooks(booksData);

      if (booksData.length === 0) {
        setError("No books found. Try another title!");
      }
    } catch {
      setError("Something went wrong. Try again later!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>📚 Book Finder</h1>
      <div>
        <input
          type="text"
          placeholder="Enter book title..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && searchBooks()}
        />
        <button onClick={searchBooks}>Search</button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : books.length === 0 ? (
        <p>Start searching for books above 📖</p>
      ) : (
        <div className="results">
          {books.map((book) => (
            <div key={book.key} className="card">
              {book.cover_i ? (
                <img
                  src={`https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`}
                  alt={book.title}
                />
              ) : (
                <div className="no-cover">No Cover</div>
              )}
              <h3>{book.title}</h3>
              <p>{book.author_name?.[0]}</p>
              <p>{book.first_publish_year}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
