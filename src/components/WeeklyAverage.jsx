import CsvTable from './CsvTable';
import { formatDateEU } from '../utils/formatDate';

/*** replace with your IDs ***/
const SHEET_ID = '1qSSupYmOg1LSFIE0A-fSrbkCKBUrktrSsJRQipnCSH4'
const GID_WEEKLY = 0
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID_WEEKLY}`;

export default function WeeklyAverage() {
  return (
    <CsvTable
      title="Weekly Average"
      csvUrl={CSV_URL}
        transformRows={(rows) =>
        rows
          .sort((a, b) => Number(b.AvgScore) - Number(a.AvgScore))
          .map((r, i) => ({ Rank: i + 1, ...r }))
          .slice(0, 5)
      }
      columns={[
        {key: 'Rank',            label: '#', align: 'right'},
        { key: 'Player',         label: 'Player' },
        { key: 'AvgScore',   label: 'Avg Score', align: 'right',
          format: (v) => Number(v).toFixed(2) },
        { key: 'Games',          label: 'Games', align: 'right' },
      ]}
    />
  );
}
