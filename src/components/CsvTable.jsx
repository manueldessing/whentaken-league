import {
  Paper,
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Tooltip,
  Box,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

/**  Color tokens */
const COLORS = {
  bg: "var(--csvtable-bg, rgba(60, 60, 60, 0.15))",
  border: "var(--csvtable-border, rgba(123, 114, 143, 0.45))",
  text: "inherit",
  headBg: "var(--csvtable-headbg, rgba(0, 0, 0, 0.25))",
};

/**
 * Generic, styled CSV-backed table
 *
 * Props:
 *  - title:         string
 *  - rawRows:       array  (already-fetched rows)
 *  - columns:       [ { key, label, align?, format? }, … ]
 *  - transformRows: (arr) => arr   (optional post-processor)
 *  - tableSx:       object (optional style overrides for Table)
 *  - borderColor:   string (optional border color override)
 *  - boldFirstRow:  boolean (optional, bold the first row in tbody)
 *  - tooltip:       string (optional – shows an ℹ️ icon next to title)
 */
export default function CsvTable({
  title,
  rawRows,
  columns,
  transformRows = (r) => r,
  tableSx = {},
  borderColor,
  boldFirstRow = false,
  tooltip,
}) {
  const effectiveBorder = borderColor || COLORS.border;

  const rows = transformRows(rawRows || []);

  return (
    <Paper
      elevation={3}
      sx={{
        color: "inherit",
        mb: 4,
        bgcolor: COLORS.bg,
        backdropFilter: "blur(4px)",
        border: 'none',
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      {title && (
        <Typography
          variant="h6"
          component="div"
          sx={{
            p: 1,
            color: COLORS.text,
            display: "flex",
            alignItems: "center",
            columnGap: 0.5,
            justifyContent: "center",
          }}
        >
          {title}
          {tooltip && (
            <Tooltip
              title={tooltip}
              arrow
              placement="top"
              enterDelay={100}
              slotProps={{
                tooltip: {
                  sx: {
                    bgcolor: "rgba(30,30,30,0.9)",
                    fontSize: "0.825rem",
                    backdropFilter: "blur(4px)",
                  },
                },
                arrow: {
                  sx: {
                    color: "rgba(30,30,30,0.9)",
                  },
                },
              }}
            >
              <InfoOutlinedIcon
                sx={{
                  fontSize: "1rem",
                  opacity: 0.8,
                  cursor: "help",
                  "&:hover": { opacity: 1 },
                }}
              />
            </Tooltip>
          )}
        </Typography>
      )}

      <TableContainer>
        <Table
          size="small"
          stickyHeader
          sx={{
            "& th, & td": {
              borderBottom: `1px solid ${effectiveBorder}`,
              color: COLORS.text,
            },
            "& th": { backgroundColor: COLORS.headBg, fontWeight: 700 },
            "& tr:nth-of-type(odd)": {
              backgroundColor: "var(--csvtable-row-odd, rgba(255,255,255,0.04))",
            },
            "& tbody tr:last-child td": {
              borderBottom: "none",
            },
            ...tableSx,
          }}
        >
          <TableHead>
            <TableRow>
              {columns.map((c) => (
                <TableCell key={c.key} align={c.align || "left"}>
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
                      align={c.align || "left"}
                      sx={
                        boldFirstRow && idx === 0
                          ? { fontWeight: 700 }
                          : undefined
                      }
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
