import { useState, useEffect } from 'react'
import './App.css'
function App() {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [clicks, setClicks] = useState(0);

useEffect(() => {
  if (!shortUrl) return;

  const code = shortUrl.split("/").pop();

  const interval = setInterval(async () => {
    const response = await fetch(
      `https://url-shortener-backend-omgk.onrender.com/clicks/${code}`
    );

    const data = await response.json();

    setClicks(data.clicks);
  }, 2000);

  return () => clearInterval(interval);

}, [shortUrl]);

  const handleShorten = async () => {
  setLoading(true);

  try {
    const response = await fetch("https://url-shortener-backend-omgk.onrender.com/shorten", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    const data = await response.json();

    if (data.error) {
      alert(data.error);
      setLoading(false);
      return;
    }

    setShortUrl(data.short_url);
    setClicks(data.clicks ?? 0);
    const code = data.short_url.split("/").pop();

const clickResponse = await fetch(
  `https://url-shortener-backend-omgk.onrender.com/clicks/${code}`
);

const clickData = await clickResponse.json();

setClicks(clickData.clicks);

  } catch (error) {
    alert("Backend server is not running");
  }

  setLoading(false);
};

const handleCopy = () => {
  navigator.clipboard.writeText(shortUrl);
  setCopied(true);

  setTimeout(() => {
    setCopied(false);
  }, 2000);
};
const getClicks = async () => {
  const code = shortUrl.split("/").pop();

  const response = await fetch(
    `http://127.0.0.1:5000/clicks/${code}`
  );

  const data = await response.json();

  setClicks(data.clicks);
};
useEffect(() => {
  if (shortUrl) {
    const interval = setInterval(() => {
      getClicks();
    }, 3000);

    return () => clearInterval(interval);
  }
}, [shortUrl]);
  return (
  <div className="container">
    <div className="card">
      <h1>🔗 URL Shortener</h1>
      <p className="subtitle">Paste your long URL below</p>

      <input
        type="text"
        placeholder="Enter your long URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <button onClick={handleShorten} disabled={loading}>
        {loading ? "Shortening..." : "Shorten URL"}
      </button>

      {shortUrl && (
        <div className="result">
          <p>Your Short URL:</p>

          <a
            href={shortUrl}
            target="_blank"
            rel="noreferrer"
            className="short-link"
          >
            {shortUrl}
          </a>

          <p className="clicks">
            Clicks: {clicks}
          </p>

          <button
            className={copied ? "copied" : "copy-btn"}
            onClick={handleCopy}
          >
            {copied ? "✅ Copied!" : "Copy URL"}
          </button>
        </div>
      )}
    </div>
  </div>
);
}

export default App;