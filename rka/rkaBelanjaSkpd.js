export function rkaBelanja(list){
    let prev = [null, null, null, null, null];
    let curr = [null, null, null, null, null];
    let res = [];
    for(let i = 0; i < list.length;){
        let row = list[i]
        curr[0] = row["kode_urusan"];
        curr[1] = row["kode_bidang_urusan"].slice(2, 4);
        curr[2] = row["kode_program"].slice(5, 7);
        curr[3] = row["kode_giat"].slice(8, 12);
        curr[4] = row["kode_sub_giat"].slice(13, 17);

        let temp = null;
        let final = false;

        if(curr[0] != prev[0]){
            temp = [curr[0], "",      "",      "",      "",      row["nama_urusan"]];
            prev[0] = curr[0];
        } else if(curr[1] != prev[1]){
            temp = [curr[0], curr[1], "",      "",      "",      row["nama_bidang_urusan"]];
            prev[1] = curr[1];
        } else if(curr[2] != prev[2]){
            temp = [curr[0], curr[1], curr[2], "",      "",      row["nama_program"]];
            prev[2] = curr[2];
        } else if(curr[3] != prev[3]){
            temp = [curr[0], curr[1], curr[2], curr[3], "",      row["nama_giat"]];
            prev[3] = curr[3];
        } else {
            temp = [curr[0], curr[1], curr[2], curr[3], curr[4], row["nama_sub_giat"]];
            prev[4] = curr[4];
            i++;
            final = true;
        }   
        console.log(temp);
        // Sumber dana, lokasi, tahun - 1
        let value = null;
        let detail = null;
        if(final){
            detail = [
                row["nama_dana"], 
                row["lokasi_bl"], 
                null
            ];
            let line = res.length + 1 + 7 // Posisi baris sebelumnya + 1 + header
            value = [
                row["bo"] ?? 0,
                row["bm"] ?? 0,
                row["btt"]?? 0,
                row["bt"] ?? 0,
                {t: "n", f: "=SUM(J"+ line + ":M" + line +")"},
                row["pagu_n_depan"],
                {t: "n", f: "=O"+ line + "-N" + line}
            ]; 
        } else {
            detail = ["", "", ""];
            value  = ["", "", "", "", "", "", ""];
        }

        temp.push(...detail, ...value);
        res.push(temp);
        
    }

    // Add formula for summing tier 5 subcode in tier 4 and tier 4 in tier 3
    for(let i = 0; i < res.length; i++){
        let row = res[i].slice(0, 5); // Only need first 5 element
        let row_tier = 5 - row.filter(x => x=="").length // Tier 1,2,3,4,5 has 4,3,2,1,0 ""
        if(row_tier == 5) {continue} // Skip tier 5 because tier 5 has no subcode

        let positions = [];

        for(let j = i + 1; j < res.length; j++){
            let curr = res[j].slice(0, 5); // Only need first 5 element
            let curr_tier = 5 - curr.filter(x => x=="").length;
            if(row_tier + 1 != curr_tier) {continue;} // Only search direct subcode
            

            // Check if curr is subcode of row
            // By checking if row and curr have common code
            if(JSON.stringify(row.slice(0, row_tier)) == 
                JSON.stringify(curr.slice(0, row_tier))){ 
                positions.push(j);
            }
        }

        for(let c = 9; c < 16; c++ ) { // Change formula in column J to P
            let letter = String.fromCharCode(c + 64 + 1); // Get nth letter of the alphabet JKLMNOP
            let cells = positions.map((x => letter + (x + 1 + 7))); // Posisi baris setelah ini + header pada kolom c
            let formula = "=" + cells.join("+");
            
            res[i][c] = {t: "n", f: formula};   
            
            console.log(formula);

        }
    }


    return res;
}

