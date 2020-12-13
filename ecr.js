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

document.querySelector("#activeNote").addEventListener('keyup', event => {
    if (lastKeyPressed == "&" && event.key == "Enter") {
        let txtAvtChangement = document.querySelector("#activeNote").innerHTML;
        document.querySelector("#activeNote").innerHTML = txtAvtChangement.replace("Je veux supprimer cette note.", "<button contenteditable='false'>Supprimer la note.</button>")
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
        notes[valeurNouvelleNote] = " ";
        updateLists();
        loadNote(document.querySelector("#" + valeurNouvelleNote));
        document.querySelector("#newNote").value = "";
        saveToMemory();
    }
})

updateLists();