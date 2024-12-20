var XLSX = require("xlsx-js-style");

// Merge cells for title and subtitles
function merge_cell(ws){
    ws["!merges"] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 12 } }, // "RENCANA KERJA ..."
        { s: { r: 0, c: 13}, e: { r: 1, c: 14 } }, // "REKAPITULASI RKA-BELANJA SKPD"
        { s: { r: 1, c: 0 }, e: { r: 1, c: 12 } },
        { s: { r: 2, c: 0 }, e: { r: 2, c: 15 } },
        { s: { r: 3, c: 0 }, e: { r: 3, c: 14 } },
        { s: { r: 4, c: 0 }, e: { r: 6, c: 4  } },
        { s: { r: 4, c: 5 }, e: { r: 6, c: 5  } },
        { s: { r: 4, c: 6 }, e: { r: 6, c: 6  } },
        { s: { r: 4, c: 7 }, e: { r: 6, c: 7  } },
        { s: { r: 4, c: 8 }, e: { r: 4, c: 14 } },
        { s: { r: 5, c: 8 }, e: { r: 6, c: 8  } },
        { s: { r: 5, c: 9 }, e: { r: 5, c: 13 } },
        { s: { r: 5, c: 14}, e: { r: 6, c: 14 } }
    ];
}

function set_width(ws){
    ws["!cols"] = [
        { wch: 9 },  // Column A
        { wch: 9 },  // Column B
        { wch: 9 },  // Column C
        { wch: 9 },  // Column D
        { wch: 9 },  // Column E
        { wch: 27 }, // Column F
        { wch: 19 }, // Column G
        { wch: 19 }, // Column H
        { wch: 19 }, // Column I
        { wch: 19 }, // Column J
        { wch: 19 }, // Column K
        { wch: 19 }, // Column L
        { wch: 19 }, // Column M
        { wch: 19 }, // Column N
        { wch: 19 }, // Column O
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
    const rightAlignment = { alignment: { vertical: "center", horizontal: 'right' } };
    
    // Define the range
    let startRow = 8;
    let startCol = 9; // Column J is the 10th column (0-indexed)
    let endCol = 14; // Column O is the 15th column (0-indexed)

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

    const centerAlignment = { alignment: { vertical: "center", horizontal: 'center', wrapText: true} };
    startRow = 8;
    startCol = 0; // Column J is the 10th column (0-indexed)
    endCol = 8; // Column O is the 15th column (0-indexed)

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
}

export function rkaBelanjaStyle(wsFinal){
    const ws = XLSX.utils.aoa_to_sheet(wsFinal);
    merge_cell(ws);
    set_width(ws);
    apply_style(ws);
    return ws;
}