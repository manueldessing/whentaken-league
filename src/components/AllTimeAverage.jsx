import CsvTable from './CsvTable';

const SHEET_ID = '1qSSupYmOg1LSFIE0A-fSrbkCKBUrktrSsJRQipnCSH4';
const GID_AT_AVG = 1111074709;

export default function AllTimeAverage() {
  const CSV = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID_AT_AVG}`;

  return (
    <CsvTable
      title="All-Time Average"
      csvUrl={CSV}
      transformRows={(rows) =>
        rows
          .sort((a, b) => Number(b.AvgScore) - Number(a.AvgScore))
          .map((r, i) => ({ Rank: i + 1, ...r }))
          .slice(0, 5)
      }
      columns={[
        { key: 'Rank',      label: '#',           align: 'right' },
        { key: 'Player',    label: 'Player' },
        { key: 'AvgScore',  label: 'Avg Score',   align: 'right',
          format: (v) => Number(v).toFixed(2) },
        { key: 'Games',     label: 'Games',       align: 'right' },
      ]}
    />
  );
}
