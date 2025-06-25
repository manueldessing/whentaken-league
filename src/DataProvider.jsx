import { createContext, useContext, useEffect, useState, useCallback } from "react";
import Papa from "papaparse";

const SHEET_ID = "1qSSupYmOg1LSFIE0A-fSrbkCKBUrktrSsJRQipnCSH4";

const CSV_ENDPOINTS = {
  allTimeAverage: 1111074709,
  allTimeBest:    577244590,  // <-- fill in the real gid’s
  weeklyAverage:  0,
  weeklyBest:     1029236952,
  playerStats:    202541998,
};

const LeagueDataCtx = createContext();

/**
 * Download every CSV in parallel once, keep it in memory, and expose
 * {data, loading, error, refresh()} to consumers.
 */
export function DataProvider({ children }) {
  const [data,    setData]    = useState({});
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

      setData(Object.fromEntries(entries));       // {allTimeAverage: [...], …}
    } catch (err) {
      console.error(err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  /* fetch once on first mount */
  useEffect(() => { fetchAll(); }, [fetchAll]);

  const value = { data, loading, error, refresh: fetchAll };
  return <LeagueDataCtx.Provider value={value}>{children}</LeagueDataCtx.Provider>;
}

export const useLeagueData = () => useContext(LeagueDataCtx);
