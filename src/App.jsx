import { useState } from "react";
import { useLeagueData } from "./DataProvider";
import WeeklyAverage from "./components/WeeklyAverage";
import AllTimeBestGames from "./components/AllTimeBestGames";
import AllTimeAverage from "./components/AllTimeAverage";
import WeeklyBestGames from "./components/WeeklyBestGames";
import PlayerStatsTable from "./components/PlayerStatsTable";
import DailyGames from "./components/DailyGames";
import ThemeSelector from "./components/ThemeSelector";
import RefreshRoundedIcon from '@mui/icons-material/RefreshRounded';

import "./App.css";

import { useContext } from "react";
import { ThemeContext } from "./theme/ThemeContext";

import githubMarkLight from "./assets/github-mark-white.svg";
import githubMarkDark from "./assets/github-mark.svg";

function App() {
  const [section, setSection] = useState("leaderboards"); // "leaderboards" or "playerstats"
  const { loading, refresh } = useLeagueData();
  const { theme } = useContext(ThemeContext);

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
          className={`side ${section === "daily" ? "active-nav" : ""}`}
          onClick={() => setSection("daily")}
        >
          Daily
        </button>
        <button
          className={`middle ${section === "leaderboards" ? "active-nav" : ""}`}
          onClick={() => setSection("leaderboards")}
        >
          Leaderboards
        </button>
        <button
          className={`side ${section === "playerstats" ? "active-nav" : ""}`}
          onClick={() => setSection("playerstats")}
        >
          Players
        </button>
      </div>
      <p className="loading-area">
        {loading ? (
          <>
            <span className="loader"></span>
            <span className="loading-text">Loading recent scores</span>
          </>
        ) : (
          <RefreshRoundedIcon
            style={{ cursor: "pointer" }}
            onClick={refresh}
            titleAccess="Refresh data"
          />
        )}
      </p>
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
      ) : section === "playerstats" ? (
        <div className="main-content playerstats">
          <PlayerStatsTable />
        </div>
      ) : (
        <div className="main-content daily">
          <DailyGames />
        </div>
      )}
      <div className="footer">
        <a
          href="https://docs.google.com/forms/d/e/1FAIpQLScn9rqFI2xErH5b5_-U0jn7ZquweAkHJN-GMEemNKSiGxzGWw/viewform?usp=dialog"
          target="_blank"
          rel="noopener noreferrer"
          className="upload-score-link"
        >
          Upload your score
        </a>
        <a
          href="https://github.com/manueldessing/whentaken-league"
          target="_blank"
          rel="noopener noreferrer"
          className="github-logo-btn"
        >
          <img
            src={
              theme === "dark" || (theme === "system" && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
                ? githubMarkLight
                : githubMarkDark
            }
            alt="GitHub"
            className="github-logo-img"
          />
        </a>
      </div>
    </div>
  );
}

export default App;
