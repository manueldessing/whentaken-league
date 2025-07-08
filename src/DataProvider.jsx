import { createContext, useContext, useEffect, useState, useCallback } from "react";
import Papa from "papaparse";

const SHEET_ID = "1qSSupYmOg1LSFIE0A-fSrbkCKBUrktrSsJRQipnCSH4";

const CSV_ENDPOINTS = {
  allTimeAverage: 1111074709,
  allTimeBest:    577244590,  // <-- fill in the real gid’s
  weeklyAverage:  0,
  weeklyBest:     1029236952,
  playerStats:    202541998,
  daily:          652681512
};

const LeagueDataCtx = createContext();
const LOCAL_STORAGE_KEY = "whentaken-league-csvdata";

/**
 * Download every CSV in parallel once, keep it in memory, and expose
 * {data, loading, error, refresh()} to consumers.
 */
export function DataProvider({ children }) {
  const [data,    setData]    = useState(() => {
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      return cached ? JSON.parse(cached) : {};
    } catch {
      return {};
    }
  });
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const entries = await Promise.all(
        Object.entries(CSV_ENDPOINTS).map(([key, gid]) =>
          new Promise((resolve, reject) =>
            Papa.parse(
              `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${gid}`,
              {
                download: true,
                header: true,
                skipEmptyLines: true,
                complete: (res) => resolve([key, res.data]),
                error: (err)   => reject(err),
              }
            )
          )
        )
      );

      const freshData = Object.fromEntries(entries);

      // Only update state/cache if data is different
      if (!isEqual(freshData, data)) {
        setData(freshData);
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(freshData));
        } catch {}
      }
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  /* On mount: show cached data immediately, then fetch fresh data */
  useEffect(() => {
    setLoading(true);
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = { data, loading, error, refresh: fetchAll };
  return <LeagueDataCtx.Provider value={value}>{children}</LeagueDataCtx.Provider>;
}

export const useLeagueData = () => useContext(LeagueDataCtx);

function isEqual(a, b) {
  // Simple deep equality check for objects/arrays
  return JSON.stringify(a) === JSON.stringify(b);
}
