if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js");
}

var notes = {};
var notesList = [];

var powerUserNote = "Notes du power-user \n• [] => Checkbox \n• Suppr la note. => Bouton pour supprimer la note définitivement."

if (localStorage.getItem("lesNotes") === null || localStorage.getItem("lesNotes") == " ") {
    console.log("Pas de données à charger.")
} else {
    notes = JSON.parse(localStorage.getItem("lesNotes"))
}

const dbPromise = idb.openDB('ecris-store', 1, {
    upgrade(db) {
        db.createObjectStore('ecris');
    },
});

const idbEcris = {
    async get(key) {
        return (await dbPromise).get('ecris', key);
    },
    async set(key, val) {
        return (await dbPromise).put('ecris', val, key);
    },
    async delete(key) {
        return (await dbPromise).delete('ecris', key);
    },
    async clear() {
        return (await dbPromise).clear('ecris');
    },
    async keys() {
        return (await dbPromise).getAllKeys('ecris');
    },
};

let uiHidden = false;
let activeNote;

const NoteToMemory = () => idbEcris.set(activeNote, document.querySelector("#activeNote").innerHTML);

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
    return new Promise(resolve => {
        let t = document.querySelector("#noteContainer");
        t.innerHTML = "";
        idbEcris.keys().then((zeKeys) => {
            for (let i in zeKeys) {
                t.insertAdjacentHTML("beforeend", "<div id='" + zeKeys[i] + "' class='uneFeuille' onClick='loadNote(this)'> > " + zeKeys[i] + " </div>")
            }
        }).then(() => {
            resolve("ok");
        })
    })
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
    idbEcris.get(e.id).then((res) => {
        document.querySelector('#activeNote').innerHTML = res;
        e.style.color = "#5770BE";
        activeNote = e.id;
        document.querySelector("#activeNote").setAttribute("contenteditable", true)
        document.querySelector('#btnNvElem').style.display = 'block';
        toContEditEnd(document.querySelector("#activeNote").querySelector('div'));
    })
}

const updateNote = (e) => {
    notes[e] = document.querySelector('#activeNote').innerHTML;
}

const supprLaNote = () => {
    idbEcris.delete(activeNote).then((e) => {
        updateLists();
        try {
            loadNote(document.querySelector(".uneFeuille"));
        } catch (e) {
            document.querySelector("#activeNote").innerHTML = '';
            document.querySelector("#activeNote").setAttribute("contenteditable", false)
        }
    })
}

const importerNotes = (e) => {
    var reader = new FileReader();
    reader.onload = (event) => {
        notes = JSON.parse(event.target.result);
        NoteToMemory();
        updateLists();
    }
    reader.readAsText(e)
}

let dictReplace = {
    "[]": "<input type='checkbox'>",
    "- ": "&#8226; ",
    ".suppr": "<button class='btnSuppr' contenteditable='false' onclick='supprLaNote()'> Supprimer la note. </button>",
    ".tableau": "<div style='position:relative; width:fit-content;'><table class='tableEcr'><div class='newColRowbtn' contenteditable='false' onclick='newRow(this)' style='top:0px;right:-20px;'>+</div><div class='newColRowbtn' contenteditable='false' onclick='newCol(this)' style='left:0px;bottom:-20px;'>+</div><tr><th>Lastname</th><th>Age</th></tr><tr><td>Smith</td><td>50</td></tr><tr><td>Jackson</td><td>94</td></tr></table></div>"
}

let timeout = null;

document.querySelector("#activeNote").addEventListener('keyup', event => {
    if (Object.keys(dictReplace).some(v => String(document.getSelection().baseNode.textContent).includes(v))) {
        let textAvant = String(document.getSelection().baseNode.parentElement.innerHTML)
        for (expr in dictReplace) {
            textAvant = textAvant.replace(expr, dictReplace[expr])
        }
        document.getSelection().baseNode.parentElement.innerHTML = textAvant;
        toContEditEnd(document.getSelection().baseNode);
    };
    clearTimeout(timeout);
    timeout = setTimeout(function () {
        NoteToMemory();
    }, 1000);
});

document.querySelector("#activeNote").addEventListener('keydown', event => {
    if (event.keyCode == 9) document.getSelection().baseNode.parentElement.insertAdjacentHTML("afterbegin", "<span class='tabSpace'></span>")
    clearTimeout(timeout);
    timeout = setTimeout(function () {
        NoteToMemory();
    }, 1000);
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
            idbEcris.set(valeurNouvelleNote, '<div><br></div>').then(e => {
                (async () => {
                    await updateLists();
                    loadNote(document.getElementById(valeurNouvelleNote));
                })();
            })
        }
        document.querySelector("#newNote").value = "";
    }
})

updateLists();