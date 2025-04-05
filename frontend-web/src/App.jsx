import React, { useEffect, useState } from 'react';

const App = () => {
  const [quotes, setQuotes] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/quotes')
      .then(res => res.json())
      .then(data => setQuotes(data));
  }, []);

  return (
    <div>
      <h1>Word Resonance</h1>
      <ul>
        {quotes.map(quote => (
          <li key={quote.id}>{quote.text}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
