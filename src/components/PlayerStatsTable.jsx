import CsvTable from "./CsvTable";
import { useLeagueData } from "../DataProvider";

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
        { key: "Games",      label: "Games",    align: "right" },
      ]}
    />
  );
}
