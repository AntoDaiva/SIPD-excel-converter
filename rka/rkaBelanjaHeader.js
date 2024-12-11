var XLSX = require("xlsx-js-style");

export function rkaBelanjaHeader() {
    return [
        ["RENCANA KERJA DAN ANGGARAN SATUAN KERJA PERANGKAT DAERAH", null, null, null, null, null, null, null, null, null, null, null, null, "REKAPITULASI RKA-BELANJA SKPD", null, null],
        ["Pemerintahan Provinsi DI Yogyakarta Tahun Anggaran 2025"],
        ["Organisasi                           :      DINAS PERTANAHAN DAN TATA RUANG"],
        ["Rincian Anggaran Belanja Berdasarkan Program dan Kegiatan"],
        ["Kode", null, null, null, null, "Uraian", "Sumber Dana", "Lokasi", "Jumlah", null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null, "Tahun - 1", "Tahun N", null, null, null, null, "Tahun + 1"],
        [null, null, null, null, null, null, null, null, null, "Belanja Operasi", "Belanja Modal", "Belanja Tidak Terduga", "Belanja Transfer", "Jumlah (Rp)"]
    ];
} 

// Merge cells for title and subtitles
export function merge_cell(ws){
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

export function set_width(ws){
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



export function apply_style(ws){
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
}


