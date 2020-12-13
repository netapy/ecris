if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("service-worker.js");
}

var notes = {};

if (localStorage.getItem("lesNotes") === null || localStorage.getItem("lesNotes") == " ") {
    console.log("Pas de données à charger.")
} else {
    notes = JSON.parse(localStorage.getItem("lesNotes"))
}

let uiHidden = false;
let activeNote;
let lastKeyPressed;

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
    "Suppr la note.": "<button class='btn-primary' contenteditable='false' onclick='supprLaNote()'>Supprimer la note.</button>",
    "[]": "<input type='checkbox'>"
}

document.querySelector("#activeNote").addEventListener('keyup', event => {
    if (event.key == "Enter") {
        let txtAvtChangement = document.querySelector("#activeNote").innerHTML;
        for (expr in dictReplace) {
            document.querySelector("#activeNote").innerHTML = txtAvtChangement.replaceAll(String(expr), dictReplace[String(expr)]);
        }
        document.execCommand('selectAll', false, null);
        document.getSelection().collapseToEnd();
    }
    lastKeyPressed = event.key;
    notes[activeNote] = document.querySelector("#activeNote").innerHTML;
    saveToMemory();
})

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
            notes[valeurNouvelleNote] = " ";
            updateLists();
            loadNote(document.querySelector("#" + valeurNouvelleNote));
            saveToMemory();
        }
        document.querySelector("#newNote").value = "";
    }
})

updateLists();