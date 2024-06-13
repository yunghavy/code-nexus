import React, { useState } from 'react';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [token, setToken] = useState('');
  const [repoName, setRepoName] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [repositories, setRepositories] = useState([]);
  const [userStats, setUserStats] = useState(null);
  const [message, setMessage] = useState('');

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'username') setUsername(value);
    if (name === 'token') setToken(value);
    if (name === 'repoName') setRepoName(value);
  };

  const handleCheckboxChange = (event) => {
    setIsPrivate(event.target.checked);
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    fetchUserStats();
    fetchRepositories();
  };

  const handleRepoSubmit = async (event) => {
    event.preventDefault();
    createRepository();
  };

  const fetchRepositories = async () => {
    try {
      const response = await fetch(`https://api.github.com/users/${username}/repos`);
      const data = await response.json();
      setRepositories(data);
    } catch (error) {
      setMessage('Error fetching repositories');
    }
  };

  const fetchUserStats = async () => {
    try {
      const response = await fetch(`https://api.github.com/users/${username}`);
      const data = await response.json();
      setUserStats(data);
    } catch (error) {
      setMessage('Error fetching user statistics');
    }
  };

  const createRepository = async () => {
    try {
      const response = await fetch(`https://api.github.com/user/repos`, {
        method: 'POST',
        headers: {
          'Authorization': `token ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: repoName,
          private: isPrivate
        })
      });
      if (response.ok) {
        setMessage('Repository created successfully');
        fetchRepositories();
      } else {
        setMessage('Error creating repository');
      }
    } catch (error) {
      setMessage('Error creating repository');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>GitHub Tool</h1>
        <p>Manage your GitHub repositories</p>
      </header>
      <main>
        <div className="forms-container">
          <form onSubmit={handleFormSubmit} className="form">
            <h2>Get Repositories</h2>
            <input
              type="text"
              name="username"
              placeholder="Enter GitHub username"
              value={username}
              onChange={handleInputChange}
            />
            <button type="submit">Get Repositories</button>
          </form>
          <form onSubmit={handleRepoSubmit} className="form">
            <h2>Create Repository</h2>
            <input
              type="text"
              name="token"
              placeholder="Enter GitHub token"
              value={token}
              onChange={handleInputChange}
            />
            <input
              type="text"
              name="repoName"
              placeholder="Enter new repository name"
              value={repoName}
              onChange={handleInputChange}
            />
            <label>
              <input
                type="checkbox"
                name="isPrivate"
                checked={isPrivate}
                onChange={handleCheckboxChange}
              />
              Private Repository
            </label>
            <button type="submit">Create Repository</button>
          </form>
        </div>
        {message && <p className="message">{message}</p>}
        {userStats && (
          <div className="user-stats">
            <h2>GitHub User Statistics</h2>
            <p><strong>Username:</strong> {userStats.login}</p>
            <p><strong>Name:</strong> {userStats.name}</p>
            <p><strong>Public Repositories:</strong> {userStats.public_repos}</p>
            <p><strong>Followers:</strong> {userStats.followers}</p>
            <p><strong>Following:</strong> {userStats.following}</p>
          </div>
        )}
        {repositories.length > 0 && (
          <div className="repositories">
            <h2>Repositories</h2>
            <ul>
              {repositories.map((repo) => (
                <li key={repo.id}>
                  <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                    {repo.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
        {username && (
          <div className="github-stats">
            <h2>GitHub Statistics</h2>
            <img src={`https://github-readme-stats.vercel.app/api?username=${username}`} alt="GitHub Stats" />
            <img src={`https://github-readme-stats.vercel.app/api/top-langs/?username=${username}`} alt="Most Used Languages" />
            <img src={`https://github-profile-trophy.vercel.app/?username=${username}`} alt="GitHub Trophies" />
            <img src={`https://github-readme-streak-stats.herokuapp.com/?user=${username}`} alt="Contribution Streak" />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
