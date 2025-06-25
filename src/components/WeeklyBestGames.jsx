import CsvTable from './CsvTable';
import { formatDateEU } from '../utils/formatDate';

const SHEET_ID = '1qSSupYmOg1LSFIE0A-fSrbkCKBUrktrSsJRQipnCSH4';
const GID_WK_BEST = 1029236952;

export default function WeeklyBestGames() {
  const CSV = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${GID_WK_BEST}`;

  return (
    <CsvTable
      title="Weekly Best Games"
      csvUrl={CSV}
      transformRows={(rows) =>
        rows
          .sort((a, b) => Number(b.Score) - Number(a.Score))
          .map((r, i) => ({ Rank: i + 1, ...r }))
          .slice(0, 5)
      }
      columns={[
        { key: 'Rank',   label: '#',       align: 'right' },
        { key: 'Player', label: 'Player' },
        { key: 'Score',  label: 'Score',   align: 'right' },
        { key: 'Date',   label: 'Date',    align: 'right', format: formatDateEU },
      ]}
    />
  );
}
