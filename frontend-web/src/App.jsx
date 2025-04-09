import React, { useEffect, useState } from 'react';

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState('');
  const [quotes, setQuotes] = useState([]);

  const handleLogin = async () => {
    const response = await fetch('http://localhost:4000/login', {
      method: 'Post',
      headers: { 'Content-Type': 'aplication/json' },
      body: JSON.stringify({ username, password})
    });

    const data = await response.json();
    if (data.token) {
      setToken(data.token);
      setIsLoggedIn(true);
      localStorage.setItem('token', data.token);
    } else {
      alert('Invalid credentials');
    }
  };

  const handleRegister = async () => {
    const response = await fetch('http://localhost:4000/register', {
      method: 'POST',
      headers: { 'Content-Type' : 'application/json' },
      body: JSON.stringify({ username, password })
    })

    const data = await response.json();
    if (data.token) {
      setToken(data.token);
      setIsLoggedIn(true);
      localStorage.setItem('token', data.token);
    } else {
      alert('Register failed');
    }
  }

  useEffect(() => {
    fetch('http://localhost:4000/quotes')
      .then(res => res.json())
      .then(data => setQuotes(data));
  }, []);

  return (
    <div>
      <h1>Word Resonance</h1>
      {isLoggedIn ? (
        <>
          <h2>Wellcome, {username}</h2>
          <ul>
            {quotes.map(quote => (
              <li key={quote.id}>{quote.text}</li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <input
            type='text'
            placeholder='Username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type='password'
            placeholder='Password'
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin}>Sign In</button>
          <button onClick={handleRegister}>Sign Up</button>
        </>
      )}
    </div>
  );
};

export default App;
