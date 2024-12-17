var XLSX = require("xlsx-js-style");

// Merge cells for title and subtitles
function merge_cell(ws){
    ws["!merges"] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } }, // "RENCANA KERJA ..."
        { s: { r: 0, c: 4}, e: { r: 1, c: 4 } }, // "Formulir RKA SKPD"
        { s: { r: 1, c: 0 }, e: { r: 1, c: 3 } }, // Pemerintahan Provinsi DI Yogyakarta Tahun Anggaran 2025
        { s: { r: 2, c: 0 }, e: { r: 2, c: 4 } }, //Organisasi : 1.03.2.10.0.00.01.0000 DINAS PERTANAHAN DAN TATA RUANG
        { s: { r: 3, c: 0 }, e: { r: 3, c: 4 } },
        { s: { r: 4, c: 0 }, e: { r: 4, c: 4 } }, //Ringkasan Anggaran Pendapatan dan Belanja Satuan Kerja Perangkat Daerah
        { s: { r: 5, c: 0 }, e: { r: 5, c: 2 } },
    ];
}

function set_width(ws){
    ws["!cols"] = [
        { wch: 9 },  // Column A
        { wch: 9 },  // Column B
        { wch: 9 },  // Column C
        { wch: 50 },  // Column D
        { wch: 20 },  // Column E
      ];
      
}

const headerStyle = {
    alignment: { vertical: "center", horizontal: "center", wrapText: true },
    font: { bold: true },
    border: {
        top:    { style: "thin" },
        bottom: { style: "thin" },
        left:   { style: "thin" },
        right:  { style: "thin" }
    }
};

function apply_style(ws){
    const range = XLSX.utils.decode_range(ws['!ref']); // Decode the range from "!ref"

    // Dynamically apply border style to all cells within the detected range` 
    for (let row = range.s.r; row <= range.e.r; row++) {
        for (let col = range.s.c; col <= range.e.c; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
            if (!ws[cellAddress]) {
            ws[cellAddress] = { v: "" }; // Create empty cell if it doesn't exist
            }
            ws[cellAddress].s = headerStyle; // Apply border style
        }
    }

    // Define the custom Rupiah format
    const rupiahFormat = '"Rp" #,##0';
    const rightAlignment = { alignment: { vertical: "center", horizontal: 'right' },
                            border: {
                                top:    { style: "thin" },
                                bottom: { style: "thin" },
                                left:   { style: "thin" },
                                right:  { style: "thin" }
                            } };
    
    // Define the range
    let startRow = 7;
    let startCol = 4; // Column J is the 10th column (0-indexed)
    let endCol = 4; // Column O is the 15th column (0-indexed)

    // Iterate over the rows and columns
    for (let row = startRow; row <= 100; row++) { // Adjust the maximum row as needed
        for (let col = startCol; col <= endCol; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: row - 1, c: col }); // Get the cell reference
            const cell = ws[cellAddress];
        
            if (cell) { // Check if the cell exists and contains a number
                cell.z = rupiahFormat; // Apply the Rupiah format
                cell.s = { ...rightAlignment }; // Apply right alignment
            }
        }
    }

    //kode rekening
    const centerAlignment = { alignment: { vertical: "center", horizontal: 'center', wrapText: true},
                            border: {
                                top:    { style: "thin" },
                                bottom: { style: "thin" },
                                left:   { style: "thin" },
                                right:  { style: "thin" }
                            } };
    startRow = 7;
    startCol = 0; // Column J is the 10th column (0-indexed)
    endCol = 2; // Column O is the 15th column (0-indexed)

    // Iterate over the rows and columns
    for (let row = startRow; row <= 100; row++) { // Adjust the maximum row as needed
        for (let col = startCol; col <= endCol; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: row - 1, c: col }); // Get the cell reference
            const cell = ws[cellAddress];
        
            if (cell) { // Check if the cell exists
                cell.s = { ...centerAlignment }; // Apply right alignment
            }
        }
    }

    //Uraian
    const leftAlignment = { alignment: { vertical: "center", horizontal: 'left', wrapText: true},
                            border: {
                                top:    { style: "thin" },
                                bottom: { style: "thin" },
                                left:   { style: "thin" },
                                right:  { style: "thin" }
                            } };
    startRow = 7;
    startCol = 3; // Column J is the 10th column (0-indexed)
    endCol = 3; // Column O is the 15th column (0-indexed)

    // Iterate over the rows and columns
    for (let row = startRow; row <= 100; row++) { // Adjust the maximum row as needed
        for (let col = startCol; col <= endCol; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: row - 1, c: col }); // Get the cell reference
            const cell = ws[cellAddress];
        
            if (cell) { // Check if the cell exists
                cell.s = { ...leftAlignment }; // Apply right alignment
            }
        }
    }
}

export function rkaSKPDStyle(wsFinal){
    const ws = XLSX.utils.aoa_to_sheet(wsFinal);
    merge_cell(ws);
    set_width(ws);
    apply_style(ws);
    return ws;
}