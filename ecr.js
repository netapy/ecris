let notes = {
    "Ma première note": "<div>Hihii voila une note okk <br>test test</div>",
    "iuiji": "<div>une autre <br>:) :) :) :)</div>",
    "Une to-do": "<div>azjfkbazuogauogaoegoaenognaognoeagazjfkbazuogauogaoegoaenognaognoeagazjfkbazuogauogaoegoaenognaognoeag</div>"
};
notes = JSON.parse(localStorage.getItem("lesNotes"))
let uiHidden = false;
let activeNote;

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
    e.style.color = "#FF8D7E";
    activeNote = e.id;
}

const updateNote = (e) => {
    notes[e] = document.querySelector('#activeNote').innerHTML;
}

document.querySelector("#activeNote").addEventListener('keyup', event => {
    notes[activeNote] = document.querySelector("#activeNote").innerHTML
    saveToMemory();
})

document.querySelector("#newNote").addEventListener('keydown', event => {
    if (event.key == "Enter") {
        let valeurNouvelleNote = document.querySelector("#newNote").value
        if (valeurNouvelleNote)
            notes[valeurNouvelleNote] = " ";
        updateLists();
        loadNote(document.querySelector("#" + valeurNouvelleNote));
        document.querySelector("#newNote").value = "";
        saveToMemory();
    }
})




updateLists();