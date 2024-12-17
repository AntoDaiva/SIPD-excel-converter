export function rkaSKPDData(data){
    let list = JSON.parse(data.response)["data"]["rincian"];
    let res = [];
    for(let i = 0; i < list.length; i++){
        let row = list[i]
        let temp = [row["kode_1"], row["kode_2"], row["kode_3"], row["uraian"], row["jumlah"]];
        res.push(temp);
    }

    // Add formula for summing tier 3 subcode in tier 2 and tier 2 in tier 1
    for(let i = 0; i < res.length; i++){
        let row = res[i].slice(0, 3); // Only need first 3 element
        let row_tier = 3 - row.filter(x => x=="").length // Tier 1,2,3 has 2,1,0 ""
        if(row_tier == 3) {continue} // Skip tier 3 because tier 3 has no subcode

        let positions = [];

        for(let j = i + 1; j < res.length; j++){
            let curr = res[j].slice(0, 3); // Only need first 3 element
            let curr_tier = 3 - curr.filter(x => x=="").length;
            if(row_tier + 1 != curr_tier) {continue;} // Only search direct subcode
            
            // Check if curr is subcode of row
            // By checking if row and curr have common code
            if(JSON.stringify(row.slice(0, row_tier)) == 
                JSON.stringify(curr.slice(0, row_tier))){ 
                positions.push(j);
            }
        }

        let letter = "E";
        let cells = positions.map((x => letter + (x + 1 + 6))); // Posisi baris setelah ini + header pada kolom c
        let formula = cells.join("+");
        res[i][4] = {t: "n", f: formula};   
    }

    return res;
}
