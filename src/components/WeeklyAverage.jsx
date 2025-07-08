import CsvTable from "./CsvTable";
import { useLeagueData } from "../DataProvider";

export default function WeeklyAverage() {
  const { data, loading } = useLeagueData();
  const rawRows = data.weeklyAverage || [];

  // if (loading) return null;

  return (
    <CsvTable
      title="Weekly Average"
      rawRows={rawRows}
      transformRows={(rows) =>
        rows
          .sort((a, b) => Number(b.AvgScore) - Number(a.AvgScore))
          .map((r, i) => ({ Rank: i + 1, ...r }))
          .slice(0, 5)
      }
      columns={[
        { key: "Rank",     label: "#",         align: "right" },
        { key: "Player",   label: "Player" },
        {
          key: "AvgScore",
          label: "Avg Score",
          align: "right",
          format: (v) => Number(v).toFixed(2),
        },
        { key: "Games",    label: "Games",     align: "right" },
      ]}
      tooltip={<>Average of <i>last</i> week's games. At least 2 games required.</>}
    />
  );
}
