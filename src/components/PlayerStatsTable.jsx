import CsvTable from "./CsvTable";
import { useLeagueData } from "../DataProvider";

function formatDistance(metresLike) {
  if (metresLike === "" || metresLike === null || metresLike === undefined) return "";
  const metres = Number(metresLike);
  if (Number.isNaN(metres)) return metresLike;

  const km = metres / 1000;

  if (km < 1) {
    // < 1 km  → metres with one decimal if < 100 m
    return `${metres.toFixed(metres < 100 ? 1 : 0)} m`;
  }

  if (km < 1000) {
    // 1 km … 999 km
    return `${km.toFixed(0)} km`;
  }

  // ≥ 1000 km  → thousands of km with optional single decimal
  const kkm = km / 1000;
  return `${kkm.toFixed(kkm < 10 ? 1 : 0)}K km`;
}


function formatYears(yearsLike) {
  if (yearsLike === "" || yearsLike === null || yearsLike === undefined) return "";
  const yrs = Number(yearsLike);
  if (Number.isNaN(yrs)) return yearsLike;
  return `${Number.isInteger(yrs) ? yrs : yrs.toFixed(1)} yrs`;
}

export default function PlayerStatsTable() {
  const { data, loading } = useLeagueData();
  const rawRows = data.playerStats || [];

  if (loading) return null;

  return (
    <CsvTable
      title="Player Stats"
      rawRows={rawRows}
      columns={[
        { key: "Player",     label: "Player" },
        { key: "BestScore",  label: "Best Score" },
        { key: "WorstScore", label: "Worst Score" },
        {
          key: "AvgScore",
          label: "Avg Score",
          align: "right",
          format: (v) => Number(v).toFixed(2),
        },
        { key: "Games",      label: "Games",           align: "right" },
        {
          key: "MeanLocDiffMeters",
          label: "📍 (mean)",
          align: "right",
          format: formatDistance,
        },
        {
          key: "MedianLocDiffMeters",
          label: "📍 (median)",
          align: "right",
          format: formatDistance,
        },
        {
          key: "MeanYearDiff",
          label: "🗓️ (mean)",
          align: "right",
          format: formatYears,
        },
      ]}
    />
  );
}
