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
            temp = [curr[0], null,    null,    null,    null,    row["nama_urusan"]];
            prev[0] = curr[0];
        } else if(curr[1] != prev[1]){
            temp = [curr[0], curr[1], null,    null,    null,    row["nama_bidang_urusan"]];
            prev[1] = curr[1];
        } else if(curr[2] != prev[2]){
            temp = [curr[0], curr[1], curr[2], null,    null,    row["nama_program"]];
            prev[2] = curr[2];
        } else if(curr[3] != prev[3]){
            temp = [curr[0], curr[1], curr[2], curr[3], null,    row["nama_giat"]];
            prev[3] = curr[3];
        } else {
            temp = [curr[0], curr[1], curr[2], curr[3], curr[4], row["nama_sub_giat"]];
            prev[4] = curr[4];
            i++;
            final = true;
        }   

        // Sumber dana, lokasi, tahun - 1
        temp.push(row["nama_dana"], row["lokasi_bl"], null); 

        let line = res.length + 8 // Posisi baris saat ini + header
        let value = [
            row["bo"] ?? 0,
            row["bm"] ?? 0,
            row["btt"]?? 0,
            row["bt"] ?? 0,
            {t: "n", f: "=SUM(J"+ line + ":M" + line +")"},
            row["pagu_n_depan"],
            {t: "n", f: "=O"+ line + "-N" + line}
        ]
        if(!final) { value = ["", "", "", "", "", "", ""];}

        temp.push(...value)

        
        res.push(temp);
        console.log(temp);
    }

    return res;
}

