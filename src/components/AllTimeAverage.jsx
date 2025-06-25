import CsvTable     from "./CsvTable";
import { useLeagueData } from "../DataProvider";

export default function AllTimeAverage() {
  const { data, loading } = useLeagueData();
  const rows = data.allTimeAverage;          // raw CSV rows already in memory

  return (
    <CsvTable
      title="All-Time Average"
      rawRows={rows}
      transformRows={(rows) =>
        rows
          .sort((a, b) => Number(b.AvgScore) - Number(a.AvgScore))
          .map((r, i) => ({ Rank: i + 1, ...r }))
          .slice(0, 5)
      }
      columns={[
        { key: "Rank",     label: "#",          align: "right" },
        { key: "Player",   label: "Player" },
        { key: "AvgScore", label: "Avg Score",  align: "right",
          format: (v) => Number(v).toFixed(2) },
        { key: "Games",    label: "Games",      align: "right" },
      ]}
    />
  );
}
