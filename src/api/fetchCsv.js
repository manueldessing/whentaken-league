import Papa from 'papaparse';

/**
 * Download + parse a Google-Sheets CSV tab.
 * Returns an array of plain JS objects (keys = column headers).
 */
export function fetchCsv(csvUrl) {
  return new Promise((resolve, reject) => {
    Papa.parse(csvUrl, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (res) => resolve(res.data),
      error: reject,
    });
  });
}