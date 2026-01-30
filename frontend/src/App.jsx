import { useEffect, useState, useRef, useCallback } from "react";
import "./App.css";

const API_URL = "https://simpletolearndeployment-ewagbshggbbtcggh.canadacentral-01.azurewebsites.net/api/messages";

function App() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [isBaking, setIsBaking] = useState(false);
  const bottomRef = useRef(null);

  const fetchMessages = useCallback(async () => {
    try {
      const res = await fetch(API_URL);
      if (!res.ok) throw new Error("Failed to fetch messages");
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error("Bunny connection lost...", err);
    }
  }, []);

  const bakeMessage = async () => {
    if (!text.trim() || isBaking) return;
    setIsBaking(true);

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) throw new Error("Failed to send message");

      setText("");
      await fetchMessages();
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    } catch (err) {
      console.error("Bunny refused your comment...", err);
    } finally {
      setTimeout(() => setIsBaking(false), 800);
    }
  };

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [fetchMessages]);

  return (
    <div className="view">
      <div className="blob1"></div>
      <div className="blob2"></div>

      <div className="card">
        <div className="bunnyWrapper">
          <div className="bunnyCircle">
            <span className="bunnyEmoji">{isBaking ? "😋" : "🐰"}</span>
          </div>
          <div className="glow"></div>
        </div>

        <h1 className="title">Bunny Bakery</h1>
        <p className="subtitle">
          I will eat your comment! 🥕<br />
          <span className="warning">Refresh and it's gone forever!</span>
        </p>

        <div className="inputContainer">
          <input
            className="input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type a comment..."
            onKeyDown={(e) => e.key === "Enter" && bakeMessage()}
          />
          <button className="button" onClick={bakeMessage} disabled={isBaking}>
            {isBaking ? "..." : "FEED"}
          </button>
        </div>

        <div className="oven">
          <div className="ovenHeader">
            <span>MY TUMMY STATUS</span>
            <div className="statusDot"></div>
          </div>

          <div className="scrollArea">
            {messages.length === 0 ? (
              <div className="empty">Feed me comments! 🧺</div>
            ) : (
              messages.map((m, i) => (
                <div key={m.id || i} className="treat">
                  <span className="treatIcon">🍪</span>
                  <span className="treatText">{m.text}</span>
                </div>
              ))
            )}
            <div ref={bottomRef} />
          </div>
        </div>

        <div className="footer">BUNNY OS • COMMENT EATER</div>
      </div>
    </div>
  );
}

export default App;
