import { rkaBelanja } from "./rka/rkaBelanja";
import { rkaSKPD } from "./rka/rkaSKPD";
import { apply_style, merge_cell,set_width, rkaBelanjaHeader } from "./rka/rkaBelanjaHeader";

(function () {
    const oldXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function () {
        this.addEventListener("load", function () {
            const targetURLs = [
                '/api/renja/laporan/rkaBelanjaSkpd', // SKPD
                // '/api/renja/laporan/rkaPendapatanSkpd',
                '/api/renja/laporan/rkaRekapitulasiBelanjaSkpd', // Belanja
                // '/api/renja/laporan/rkaPembiayaanSkpd'
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
                console.log(data.url);
                

                let wsData = null;
                let wsHeader = null;
                let filename = null;
                // console.log(data.url.split("/").pop());
                switch(data.url.split("/").pop()){ // Get last url component
                    case "rkaBelanjaSkpd":
                        wsData = rkaBelanja(list);
                        wsHeader = rkaBelanjaHeader();
                        filename = "Laporan Belanja"
                        console.log("SKPD");
                        break;
                    case "rkaRekapitulasiBelanjaSkpd":
                        wsData = rkaBelanja(list);
                        wsHeader = rkaBelanjaHeader();
                        filename = "Laporan SKPD"
                        console.log("Belanja");
                        break;
                    default:
                        console.log("Not implemented yet");
                }
                
                let wsFinal = [...wsHeader, ...wsData];

                var XLSX = require("xlsx-js-style");
                let wb = XLSX.utils.book_new();
                wb.Props = {
                    Title: "Laporan SIPD RI",
                    Subject: "Laporan SIPD RI",
                    Author: "SIPD RI",
                };

                const ws = XLSX.utils.aoa_to_sheet(wsFinal);
                merge_cell(ws);
                set_width(ws);
                apply_style(ws);

                XLSX.utils.book_append_sheet(wb, ws, "Rekap");
                XLSX.writeFile(wb, filename + ".xlsx");
                
            }
        });
        return oldXHROpen.apply(this, arguments);
    };

    console.log("Injected script successfully loaded!");
})();
