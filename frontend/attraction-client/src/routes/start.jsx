import { Link } from "react-router-dom";

export default function Start() {
    return (
      <main style={{ padding: "1rem 0" }}>
        <h2>Du befindest dich auf der Startseite.</h2>
        <Link to="/">Home</Link>
      </main>
    );
  }