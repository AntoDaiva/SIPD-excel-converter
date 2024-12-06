import { rkaBelanja } from "./rka/rkaBelanjaSkpd";
// import "./xlsx.js";
// import "./FileSaver.js";
// import  "xlsx";
(function () {
    const oldXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function () {
        this.addEventListener("load", function () {
            const targetURLs = [
                '/api/renja/laporan/rkaBelanjaSkpd',
                '/api/renja/laporan/rkaPendapatanSkpd',
                '/api/renja/laporan/rkaRekapitulasiBelanjaSkpd',
                '/api/renja/laporan/rkaPembiayaanSkpd'
            ];

            if (targetURLs.some(url => this.responseURL.includes(url))) {
                const data = {
                    url: this.responseURL,
                    response: this.responseText
                };
                console.log("Intercepted Response:", this.responseText);
                // Send data to the background script
                window.postMessage({ type: "INTERCEPTED_DATA", data }, "*");


                let list = JSON.parse(data.response)["data"];
                console.log(list);
                let worksheetData = rkaBelanja(list);

                const worksheetHeader = [
                    ["RENCANA KERJA DAN ANGGARAN SATUAN KERJA PERANGKAT DAERAH", null, null, null, null, null, null, null, null, null, null, null, null, "REKAPITULASI RKA-BELANJA SKPD", null, null],
                    ["Pemerintahan Provinsi DI Yogyakarta Tahun Anggaran 2025"],
                    ["Organisasi                           :      DINAS PERTANAHAN DAN TATA RUANG"],
                    ["Rincian Anggaran Belanja Berdasarkan Program dan Kegiatan"],
                    ["Kode", null, null, null, null, "Uraian", "Sumber Dana", "Lokasi", "Jumlah", null, null, null, null, null, null],
                    [null, null, null, null, null, null, null, null, "Tahun - 1", "Tahun N", null, null, null, null, "Tahun + 1"],
                    [null, null, null, null, null, null, null, null, null, "Belanja Operasi", "Belanja Modal", "Belanja Tidak Terduga", "Belanja Transfer", "Jumlah (Rp)"]
                  ];
                
                worksheetFinal = [...worksheetHeader, ...worksheetData];
                
                var XLSX = require("xlsx-js-style");
                let wb = XLSX.utils.book_new();
                wb.Props = {
                    Title: "Laporan",
                    Subject: "Testing",
                    Author: "SIPD RI",
                };
                const ws = XLSX.utils.aoa_to_sheet(worksheetFinal);

                // Merge cells for title and subtitles
                ws["!merges"] = [
                    { s: { r: 0, c: 0 }, e: { r: 0, c: 12 } }, // "RENCANA KERJA ..."
                    { s: { r: 0, c: 13 }, e: { r: 1, c: 14 } }, // "REKAPITULASI RKA-BELANJA SKPD"
                    { s: { r: 1, c: 0 }, e: { r: 1, c: 12 } },
                    { s: { r: 2, c: 0 }, e: { r: 2, c: 15 } },
                    { s: { r: 3, c: 0 }, e: { r: 3, c: 14 } },
                    { s: { r: 4, c: 0 }, e: { r: 6, c: 4 } },
                    { s: { r: 4, c: 5 }, e: { r: 6, c: 5 } },
                    { s: { r: 4, c: 6 }, e: { r: 6, c: 6 } },
                    { s: { r: 4, c: 7 }, e: { r: 6, c: 7 } },
                    { s: { r: 4, c: 8 }, e: { r: 4, c: 14 } },
                    { s: { r: 5, c: 8 }, e: { r: 6, c: 8 } },
                    { s: { r: 5, c: 9 }, e: { r: 5, c: 13 } },
                    { s: { r: 5, c: 14 }, e: { r: 6, c: 14 } }
                  ];
                
                const headerStyle = {
                alignment: { vertical: "center", horizontal: "center" },
                font: { bold: true },
                border: {
                    top: { style: "thin" },
                    bottom: { style: "thin" },
                    left: { style: "thin" },
                    right: { style: "thin" }
                }
                };
                
                Object.keys(ws).forEach(key => {
                if (!key.startsWith("!")) {
                    ws[key].s = headerStyle;
                }
                });

                XLSX.utils.book_append_sheet(wb, ws, "Template");
                
                XLSX.writeFile(wb, "Test.xlsx");

                // let wbout = XLSX.write(wb, {bookType: "xlsx", type: "binary"});
                
                // function s2ab(s){
                //     var buf = new ArrayBuffer(s.length);
                //     var view = new Uint8Array(buf);
                //     for(let i = 0; i < s.length; i++){
                //         view[i] = s.charCodeAt(i) & 0xFF;
                //     }
                //     return buf;
                // }
                // saveAs(new Blob([s2ab(wbout)], {type:"application/octet-stream"}), "test.xlsx");
            }
        });
        return oldXHROpen.apply(this, arguments);
    };

    console.log("Injected script successfully loaded!");
})();
