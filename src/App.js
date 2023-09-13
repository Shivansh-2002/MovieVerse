import React, { useEffect } from 'react';
import './App.css';

const apiKey = 'cbf5ab5d';

function App() {
  useEffect(() => {
    const searchInput = document.getElementById('searchInput');
    const searchResultsDiv = document.getElementById('searchResults');

    function handleKeyDown(event) {
      if (event.key === 'Enter') {
        searchMovies();
      }
    }

    searchInput.addEventListener('keydown', handleKeyDown);

    return () => {
      // Clean up the event listener when the component unmounts
      searchInput.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  async function searchMovies() {
    const searchInput = document.getElementById('searchInput').value.trim().toLowerCase();
    const searchResultsDiv = document.getElementById('searchResults');
    searchResultsDiv.innerHTML = '';
  
    if (!searchInput) {
      searchResultsDiv.innerHTML = 'Please enter a movie name.';
      return;
    }
  
    try {
      const response = await fetch(`https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent(searchInput)}`);
      const data = await response.json();
  
      if (data.Response === 'True') {
        const movieResults = data.Search;
  
        if (movieResults.length === 0) {
          searchResultsDiv.innerHTML = 'No results found.';
        } else {
          const filteredMovies = movieResults.filter((movie) =>
            movie.Title.toLowerCase().includes(searchInput)
          );
  
          if (filteredMovies.length === 0) {
            searchResultsDiv.innerHTML = 'No results found.';
          } else {
            const movieCards = filteredMovies.map(createMovieCard);
            movieCards.forEach((card) => searchResultsDiv.appendChild(card));
          }
        }
      } else {
        searchResultsDiv.innerHTML = 'No results found.';
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      searchResultsDiv.innerHTML = 'An error occurred. Please try again later.';
    }
  }

  function createMovieCard(movie) {
    const cardDiv = document.createElement('div');
    cardDiv.classList.add('movie-card');

    const titleElement = document.createElement('p');
    titleElement.textContent = movie.Title;
    titleElement.classList.add('movie-title');

    const posterElement = document.createElement('img');
    posterElement.src = movie.Poster === 'N/A' ? 'nothingToSee.png' : movie.Poster;
    posterElement.alt = movie.Title;
    posterElement.classList.add('movie-poster');

    cardDiv.appendChild(titleElement);
    cardDiv.appendChild(posterElement);

    return cardDiv;
  }

  return (
    <div className="background">
      <div className="container">
        <h1 className="title">MovieVerse</h1>
        <input type="text" id="searchInput" placeholder="Enter a movie name..." />
        <button onClick={searchMovies}>Search</button>
        <div id="searchResults"></div>
      </div>
    </div>
  );
}

export default App;
