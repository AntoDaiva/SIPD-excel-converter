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

const headerStyle = {
    alignment: { vertical: "center", horizontal: "center" },
    font: { bold: true },
    border: {
        top:    { style: "thin" },
        bottom: { style: "thin" },
        left:   { style: "thin" },
        right:  { style: "thin" }
    }
};

export function apply_style(ws){
    Object.keys(ws).forEach(key => {
        if (!key.startsWith("!")) {
            ws[key].s = headerStyle;
        }
    });
}


