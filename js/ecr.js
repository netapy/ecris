if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js");
}

var notes = {};

var powerUserNote = "Notes du power-user \n• [] => Checkbox \n• Suppr la note. => Bouton pour supprimer la note définitivement."

if (localStorage.getItem("lesNotes") === null || localStorage.getItem("lesNotes") == " ") {
    console.log("Pas de données à charger.")
} else {
    notes = JSON.parse(localStorage.getItem("lesNotes"))
}

let uiHidden = false;
let activeNote;

const saveToMemory = () => localStorage.setItem("lesNotes", JSON.stringify(notes))

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
}

function toContEditEnd(contentEditableElement) {
    let range, selection;
    if (document.createRange) {
        range = document.createRange();
        range.selectNodeContents(contentEditableElement);
        range.collapse(false);
        selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    } else if (document.selection) {
        range = document.body.createTextRange();
        range.moveToElementText(contentEditableElement);
        range.collapse(false);
        range.select();
    }
}

const updateLists = () => {
    let t = document.querySelector("#noteContainer");
    t.innerHTML = "";
    for (var i in notes) {
        t.insertAdjacentHTML("beforeend", "<div id='" + i + "' class='uneFeuille' onClick='loadNote(this)'> > " + i + " </div>")
    }
}

const toggleUi = () => {
    if (!uiHidden) {
        document.querySelector("#filezonee").style.display = 'none';
        uiHidden = true;
    } else {
        document.querySelector("#filezonee").style.display = 'block';
        uiHidden = false;
    }
}

const loadNote = (e) => {
    for (var i = 0; i < document.querySelectorAll('.uneFeuille').length; i++) {
        document.querySelectorAll('.uneFeuille')[i].style.color = "black";
    }
    document.querySelector('#activeNote').innerHTML = notes[e.id];
    e.style.color = "#5770BE";
    activeNote = e.id;
    document.querySelector("#activeNote").setAttribute("contenteditable", true)
    document.querySelector('#btnNvElem').style.display = 'block';
}

const updateNote = (e) => {
    notes[e] = document.querySelector('#activeNote').innerHTML;
}

const supprLaNote = () => {
    delete notes[activeNote];
    saveToMemory();
    updateLists();
    try {
        loadNote(document.querySelector(".uneFeuille"));
    } catch (e) {
        document.querySelector("#activeNote").innerHTML = '';
        document.querySelector("#activeNote").setAttribute("contenteditable", false)
    }
}

const importerNotes = (e) => {
    var reader = new FileReader();
    reader.onload = (event) => {
        notes = JSON.parse(event.target.result);
        saveToMemory();
        updateLists();
    }
    reader.readAsText(e)
}

let dictReplace = {
    "Suppr la note": "<button class='btnSuppr' contenteditable='false' onclick='supprLaNote()'> Supprimer la note. </button>",
    "[]": "<input type='checkbox'>",
    "- ": "&#8226; ",
    ".tableau": "<div style='position:relative; width:fit-content;'><table class='tableEcr'><div class='newColbtn' contenteditable='false' onclick='newRow(this)'>+</div><div class='newRowbtn' contenteditable='false' onclick='newCol(this)'>+</div><tr><th>Lastname</th><th>Age</th></tr><tr><td>Smith</td><td>50</td></tr><tr><td>Jackson</td><td>94</td></tr></table></div>"
}

document.querySelector("#activeNote").addEventListener('keyup', event => {
    if (Object.keys(dictReplace).some(v => String(document.getSelection().baseNode.textContent).includes(v))) {
        console.log("changement devrait avoir lieu !")
        let textAvant = String(document.getSelection().baseNode.parentElement.innerHTML)
        for (expr in dictReplace) {
            textAvant = textAvant.replace(expr, dictReplace[expr])
        }
        document.getSelection().baseNode.parentElement.innerHTML = textAvant;
        toContEditEnd(document.getSelection().baseNode);
    };

    notes[activeNote] = document.querySelector("#activeNote").innerHTML;
    saveToMemory();
});
document.querySelector("#activeNote").addEventListener('keydown', event => {
    if (event.keyCode == 9) document.getSelection().baseNode.parentElement.insertAdjacentHTML("afterbegin", "<span class='tabSpace'></span>")
    notes[activeNote] = document.querySelector("#activeNote").innerHTML;
    saveToMemory();
});

document.querySelector("#newNote").addEventListener('keyup', event => {
    let valeurNouvelleNote = document.querySelector("#newNote").value
    if (event.key == "Enter" && valeurNouvelleNote != "") {
        if (["importer", "import"].includes(valeurNouvelleNote)) {
            swal("Choisis ton fichier à importer.", {
                    buttons: {
                        cancel: "Annuler.",
                        catch: {
                            text: "Choisir fichier",
                            value: "catch",
                        }
                    },
                })
                .then((value) => {
                    switch (value) {
                        case "catch":
                            document.getElementById('file-input').click();
                            break;
                        default:
                            break;
                    }
                });
        } else {
            notes[valeurNouvelleNote] = "<div><br></div>";
            updateLists();
            loadNote(document.querySelector("#" + valeurNouvelleNote));
            saveToMemory();
        }
        document.querySelector("#newNote").value = "";
    }
})

updateLists();

