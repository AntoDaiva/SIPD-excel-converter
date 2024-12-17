import { rkaBelanja } from "./rka/rkaBelanja";
import { apply_style, merge_cell,set_width, rkaBelanjaHeader } from "./rka/rkaBelanjaHeader";
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
                // console.log("Intercepted Response:", this.responseText);
                // Send data to the background script
                window.postMessage({ type: "INTERCEPTED_DATA", data }, "*");
                let list = JSON.parse(data.response)["data"];
                console.log(list);

                let worksheetData = rkaBelanja(list);
                let worksheetHeader = rkaBelanjaHeader()
                let worksheetFinal = [...worksheetHeader, ...worksheetData];

                var XLSX = require("xlsx-js-style");
                let wb = XLSX.utils.book_new();
                wb.Props = {
                    Title: "Laporan",
                    Subject: "Testing",
                    Author: "SIPD RI",
                };

                const ws = XLSX.utils.aoa_to_sheet(worksheetFinal);
                merge_cell(ws);
                set_width(ws)
                
                XLSX.utils.book_append_sheet(wb, ws, "Template");
                apply_style(ws)
                
                XLSX.writeFile(wb, "Test.xlsx");
                
            }
        });
        return oldXHROpen.apply(this, arguments);
    };

    console.log("Injected script successfully loaded!");
})();
