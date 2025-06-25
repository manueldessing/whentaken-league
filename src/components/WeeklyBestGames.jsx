import CsvTable from "./CsvTable";
import { useLeagueData } from "../DataProvider";
import { formatDateEU } from "../utils/formatDate";

export default function WeeklyBestGames() {
  const { data, loading } = useLeagueData();
  const rawRows = data.weeklyBest || [];

//   if (loading) return null;

  return (
    <CsvTable
      title="Weekly Best Games"
      rawRows={rawRows}
      transformRows={(rows) =>
        rows
          .sort((a, b) => Number(b.Score) - Number(a.Score))
          .map((r, i) => ({ Rank: i + 1, ...r }))
          .slice(0, 5)
      }
      columns={[
        { key: "Rank",   label: "#",     align: "right" },
        { key: "Player", label: "Player" },
        { key: "Score",  label: "Score", align: "right" },
        { key: "Date",   label: "Date",  align: "right", format: formatDateEU },
      ]}
      tooltip={<>Best game of <i>last</i> week</>}
    />
  );
}
