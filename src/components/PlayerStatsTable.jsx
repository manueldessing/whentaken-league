import CsvTable from './CsvTable';

const SHEET_ID = '1qSSupYmOg1LSFIE0A-fSrbkCKBUrktrSsJRQipnCSH4';
const GID_AT_AVG = 202541998;

export default function PlayerStatsTable() {
  const CSV = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID_AT_AVG}`;

  return (
    <CsvTable
      title="Player Stats"
      csvUrl={CSV}
      columns={[
        { key: 'Player',    label: 'Player' },
        { key: 'BestScore', label: 'Best Score'},
        { key: 'WorstScore', label: 'Worst Score'},
        { key: 'AvgScore',  label: 'Avg Score',   align: 'right',
          format: (v) => Number(v).toFixed(2) },
        { key: 'Games',     label: 'Games',       align: 'right' },
      ]}
    />
  );
}
