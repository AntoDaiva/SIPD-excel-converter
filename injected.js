import { rkaBelanjaData   } from "./rka/rkaBelanjaData";
import { rkaBelanjaHeader } from "./rka/rkaBelanjaHeader";
import { rkaBelanjaStyle  } from "./rka/rkaBelanjaStyle";
import { rkaSKPDData   } from "./rka/rkaSKPDData";
import { rkaSKPDHeader } from "./rka/rkaSKPDHeader";
import { rkaSKPDStyle  } from "./rka/rkaSKPDStyle";

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
                // window.postMessage({ type: "INTERCEPTED_DATA", data }, "*");            

                let wsData   = null;
                let wsHeader = null;
                let wsFinal  = null;
                let ws       = null;
                let filename = null;
                // console.log(data.url.split("/").pop());
                switch(data.url.split("/").pop()){ // Get last url component
                    case "rkaBelanjaSkpd": // SKPD
                        wsData   = rkaSKPDData(data);
                        wsHeader = rkaSKPDHeader();
                        wsFinal  = [...wsHeader, ...wsData];
                        ws       = rkaSKPDStyle(wsFinal);
                        filename = "Laporan SKPD"
                        console.log("SKPD");
                        break;
                    case "rkaRekapitulasiBelanjaSkpd":
                        wsData   = rkaBelanjaData(data);
                        wsHeader = rkaBelanjaHeader();
                        wsFinal  = [...wsHeader, ...wsData];
                        ws       = rkaBelanjaStyle(wsFinal);
                        filename = "Laporan Belanja"
                        console.log("Belanja");
                        break;
                    default:
                        console.log("Not implemented yet");
                }
                
                var XLSX = require("xlsx-js-style");
                let wb = XLSX.utils.book_new();
                wb.Props = {
                    Title: "Laporan SIPD RI",
                    Subject: "Laporan SIPD RI",
                    Author: "SIPD RI",
                };

                XLSX.utils.book_append_sheet(wb, ws, "Rekap");
                XLSX.writeFile(wb, filename + ".xlsx");                
            }
        });
        return oldXHROpen.apply(this, arguments);
    };

    console.log("Injected script successfully loaded!");
})();
