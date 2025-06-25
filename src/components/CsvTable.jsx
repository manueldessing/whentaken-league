import { useEffect, useState } from 'react';
import Papa from 'papaparse';
import {
  Paper, Typography, TableContainer, Table,
  TableHead, TableRow, TableCell, TableBody,
} from '@mui/material';

/**  Color tokens – adjust here once  */
const COLORS = {
  bg:     'rgba(60, 60, 60, 0.15)', // neutral, 65 % opacity
  border: 'rgba(123, 114, 143, 0.45)', 
  text:   'inherit',       
  headBg: 'rgba(0, 0, 0, 0.25)',    // header strip
};

/**
 * Generic, styled CSV-backed table
 *
 * Props:
 *  - title:   string
 *  - csvUrl:  string  (public CSV export URL)
 *  - columns: [ { key, label, align?, format? }, … ]
 *  - transformRows?: (arr) => arr   (optional post-processor)
 *  - tableSx?: object (optional style overrides for Table)
 *  - borderColor?: string (optional border color override)
 *  - boldFirstRow?: boolean (optional, bold the first row in tbody)
 */
export default function CsvTable({
  title,
  rawRows,
  columns,
  transformRows = (r) => r,
  tableSx = {},
  borderColor,
  boldFirstRow = false,
}) {
  const effectiveBorder = borderColor || COLORS.border;

  const rows = transformRows(rawRows || []); 
  
  return (
    <Paper
      elevation={3}
      sx={{
        color: 'inherit',
        mb: 4,
        bgcolor: COLORS.bg,
        backdropFilter: 'blur(4px)',
        border: `2px solid ${effectiveBorder}`,
      }}
    >
      {title && (
        <Typography variant="h6" sx={{ p: 1, color: COLORS.text }}>
          {title}
        </Typography>
      )}

      <TableContainer>
        <Table
          size="small"
          stickyHeader
          sx={{
            '& th, & td': {
              borderBottom: `1px solid ${effectiveBorder}`,
              color: COLORS.text,
            },
            '& th': { backgroundColor: COLORS.headBg, fontWeight: 700 },
            '& tr:nth-of-type(odd)': {
              backgroundColor: 'rgba(255,255,255,0.04)',
            },
            ...tableSx,
          }}
        >
          <TableHead>
            <TableRow>
              {columns.map((c) => (
                <TableCell key={c.key} align={c.align || 'left'}>
                  {c.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((r, idx) => (
              <TableRow
                key={idx}
                sx={boldFirstRow && idx === 0 ? { fontWeight: 700 } : undefined}
              >
                {columns.map((c) => {
                  const raw = r[c.key];
                  const value = c.format ? c.format(raw, r) : raw;
                  return (
                    <TableCell
                      key={c.key}
                      align={c.align || 'left'}
                      sx={boldFirstRow && idx === 0 ? { fontWeight: 700 } : undefined}
                    >
                      {value}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  );
}
