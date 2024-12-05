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
                let res = rkaBelanja(list);
                
                var XLSX = require("xlsx-style");
                let wb = XLSX.utils.book_new();
                wb.Props = {
                    Title: "Laporan",
                    Subject: "Testing",
                    Author: "SIPD RI",
                };
                wb.SheetNames.push("Sheet1");

                let ws = XLSX.utils.aoa_to_sheet(res);
                wb.Sheets["Sheet1"] = ws;
                
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
