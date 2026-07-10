import { useState } from 'react'
import './App.css'
function App() {
  const [url, setUrl] = useState('');
  const handleShorten = () => {
  console.log(url);
};
  return (
    <div className="container">
      <h1>URL Shortener</h1>
      <p>Paste your long URL below</p>

      <input
  type="text"
  placeholder="Enter your long URL"
  value={url}
  onChange={(e) => setUrl(e.target.value)}
/>
      <button onClick={handleShorten}>
  Shorten URL
</button>
    </div>
  );
}

export default App;