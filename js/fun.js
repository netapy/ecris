const newCol = (elem) => {
    let table = elem.parentElement.querySelector(".tableEcr");
    let row = table.insertRow();
    for (let i = 0; i < table.rows[0].cells.length; i++) {
        let newCell = row.insertCell(i);
        newCell.setAttribute("contenteditable",true)
    }
}

const newRow = (elem) => {
    let table = elem.parentElement.querySelector(".tableEcr");
    for (let i = 0; i < table.rows.length; i++) {
        let newCell = table.rows[i].insertCell(table.rows[i].cells.length);
        newCell.setAttribute("contenteditable",true)
    }
}

const ectCheckbox = (ee) => {
    if (ee.checked) {
        ee.nextSibling.style.opacity = '.5';
        ee.nextSibling.style.textDecoration = 'line-through';
        ee.setAttribute('checked', true);
    } else {
        ee.nextSibling.style.opacity = '1';
        ee.nextSibling.style.textDecoration = 'none';
        ee.setAttribute('checked', false);
    }
    NoteToMemory();
}

