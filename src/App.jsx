import { useState } from "react";
import WeeklyAverage from "./components/WeeklyAverage";
import AllTimeBestGames from "./components/AllTimeBestGames";
import AllTimeAverage from "./components/AllTimeAverage";
import WeeklyBestGames from "./components/WeeklyBestGames";
import PlayerStatsTable from "./components/PlayerStatsTable";
import ThemeSelector from "./components/ThemeSelector";
import "./App.css";

function App() {
  const [section, setSection] = useState("leaderboards"); // "leaderboards" or "playerstats"

  return (
    <div className="main-page">
      <div className="header">
        {/* <div className="header-spacer" /> */}
        <h2>
          Data Science{" "}
          <a
            href="https://whentaken.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="whentaken-link"
          >
            <b>WhenTaken</b>
          </a>{" "}
          League
        </h2>
        <div className="theme-selector-container">
          <ThemeSelector fontSize="1em" />
        </div>
      </div>
      <div className="nav-buttons">
        <button
          className={section === "leaderboards" ? "active-nav" : ""}
          onClick={() => setSection("leaderboards")}
        >
          Leaderboards
        </button>
        <button
          className={section === "playerstats" ? "active-nav" : ""}
          onClick={() => setSection("playerstats")}
        >
          Player Stats
        </button>
      </div>
      {section === "leaderboards" ? (
        <div className="main-content leaderboards">
          <div className="all-time-best-table">
            <AllTimeBestGames />
          </div>

          {/* Row-2, three side-by-side */}
          <div className="left-table">
            <AllTimeAverage />
          </div>
          <div className="center-table">
            <WeeklyBestGames />
          </div>
          <div className="right-table">
            <WeeklyAverage />
          </div>
        </div>
      ) : (
        <div className="main-content playerstats">
          <PlayerStatsTable />
        </div>
      )}
      <div className="footer">
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLScn9rqFI2xErH5b5_-U0jn7ZquweAkHJN-GMEemNKSiGxzGWw/viewform?usp=dialog"
          target="_blank"
          rel="noopener noreferrer"
        >
          Upload your score
        </a>
      </div>
    </div>
  );
}

export default App;
