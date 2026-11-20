import { CsvParseResult, RawCsvRow } from '../../types/survey';
import { suggestColumnMapping } from './columnMapper';

/**
 * Robust RFC 4180-compliant CSV Parser for browser client execution.
 * Handles UTF-8 BOM, quoted cells with commas, escaped quotes (""), and varied CRLF/LF linebreaks.
 */
export function parseCsvText(rawText: string): CsvParseResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!rawText || rawText.trim().length === 0) {
    return {
      isValid: false,
      headers: [],
      rows: [],
      totalRows: 0,
      errors: ['The uploaded CSV file is empty.'],
      warnings: [],
      suggestedMapping: {},
    };
  }

  // 1. Strip UTF-8 BOM if present (\uFEFF)
  let cleanText = rawText;
  if (cleanText.charCodeAt(0) === 0xfeff) {
    cleanText = cleanText.slice(1);
  }

  // 2. Tokenize rows and cells
  const lines: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let insideQuotes = false;
  let i = 0;
  const len = cleanText.length;

  while (i < len) {
    const char = cleanText[i];
    const nextChar = i + 1 < len ? cleanText[i + 1] : '';

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        // Escaped quote: "" -> "
        currentField += '"';
        i += 2;
        continue;
      } else {
        // Toggle quote state
        insideQuotes = !insideQuotes;
        i++;
        continue;
      }
    }

    if (char === ',' && !insideQuotes) {
      // Cell delimiter
      currentRow.push(currentField.trim());
      currentField = '';
      i++;
      continue;
    }

    if ((char === '\r' || char === '\n') && !insideQuotes) {
      // Row delimiter
      currentRow.push(currentField.trim());
      currentField = '';

      // Skip \r\n pair
      if (char === '\r' && nextChar === '\n') {
        i += 2;
      } else {
        i++;
      }

      // Only push non-empty rows
      if (currentRow.some((cell) => cell.length > 0)) {
        lines.push(currentRow);
      }
      currentRow = [];
      continue;
    }

    // Normal character
    currentField += char;
    i++;
  }

  // Push final field/row if any remaining
  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some((cell) => cell.length > 0)) {
      lines.push(currentRow);
    }
  }

  if (insideQuotes) {
    errors.push('Unclosed quote detected in CSV file. Check for mismatched quotation marks.');
  }

  if (lines.length === 0) {
    return {
      isValid: false,
      headers: [],
      rows: [],
      totalRows: 0,
      errors: ['No tabular data rows found in the CSV.'],
      warnings: [],
      suggestedMapping: {},
    };
  }

  // Header extraction
  const rawHeaders = lines[0];
  const headers = rawHeaders.map((h, idx) => (h ? h.trim() : `Column_${idx + 1}`));

  if (headers.length === 0) {
    return {
      isValid: false,
      headers: [],
      rows: [],
      totalRows: 0,
      errors: ['Failed to read column headers from the first row.'],
      warnings: [],
      suggestedMapping: {},
    };
  }

  // Data rows extraction
  const rows: RawCsvRow[] = [];
  const expectedColCount = headers.length;

  for (let r = 1; r < lines.length; r++) {
    const rowValues = lines[r];
    const rowObj: RawCsvRow = {};

    for (let c = 0; c < headers.length; c++) {
      const headerName = headers[c];
      rowObj[headerName] = c < rowValues.length ? rowValues[c] : '';
    }

    if (rowValues.length !== expectedColCount) {
      warnings.push(
        `Row ${r + 1} has ${rowValues.length} columns (expected ${expectedColCount}). Missing fields were populated as empty strings.`
      );
    }

    rows.push(rowObj);
  }

  const suggestedMapping = suggestColumnMapping(headers);

  return {
    isValid: errors.length === 0,
    headers,
    rows,
    totalRows: rows.length,
    errors,
    warnings,
    suggestedMapping,
  };
}

