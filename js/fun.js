const newCol = (elem) => {
    let table = elem.parentElement.querySelector(".tableEcr");
    let row = table.insertRow();
    for (let i = 0; i < table.rows[0].cells.length; i++) {
        row.insertCell(i);
    }
}

const newRow = (elem) => {
    let table = elem.parentElement.querySelector(".tableEcr");
    for (let i = 0; i < table.rows.length; i++) {
        table.rows[i].insertCell(table.rows[i].cells.length);
    }
}