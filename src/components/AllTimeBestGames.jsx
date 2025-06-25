import CsvTable from "./CsvTable";
import { useLeagueData } from "../DataProvider";
import { formatDateEU } from "../utils/formatDate";

export default function AllTimeBestGames() {
  const { data, loading } = useLeagueData();
  const rawRows = data.allTimeBest || [];

  const formatRank = (rank) => {
    switch (Number(rank)) {
      case 1: return "🥇";
      case 2: return "🥈";
      case 3: return "🥉";
      default: return rank;
    }
  };

//   if (loading) return null;               // or render a spinner

  return (
    <CsvTable
      title="All-Time Best Games"
      rawRows={rawRows}
      transformRows={(rows) =>
        rows
          .sort((a, b) => Number(b.Score) - Number(a.Score))
          .map((r, i) => ({ Rank: i + 1, ...r }))
          .slice(0, 5)
      }
      columns={[
        { key: "Rank",   label: "#",     align: "right", format: formatRank },
        { key: "Player", label: "Player" },
        { key: "Score",  label: "Score", align: "right" },
        { key: "Date",   label: "Date",  align: "right", format: formatDateEU },
      ]}
      borderColor="rgba(230, 213, 98, 0.71)"
      tableSx={{
        "& th, & td": {
          borderBottom: "1px solid rgba(123, 114, 143, 0.45)",
          color: "inherit",
        },
      }}
      boldFirstRow
    />
  );
}
