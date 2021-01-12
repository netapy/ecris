if ("serviceWorker" in navigator) {
    window.addEventListener('load', function () {
        navigator.serviceWorker.register("sw.js");
    });
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
let lastAction;

const NoteToMemory = () => idbEcris.set(activeNote, document.querySelector(".ql-editor").innerHTML);

function download(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
};

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
};

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
};

const toggleUi = () => {
    if (!uiHidden) {
        document.querySelector("#filezonee").style.display = 'none';
        document.querySelector(".textZone").style.maxHeight = '100vh';
        uiHidden = true;
    } else {
        document.querySelector("#filezonee").style.display = 'block';
        document.querySelector(".textZone").style = '';
        uiHidden = false;
    }
};
var quill;

var toolbarOptions = [
    ['bold', 'italic', 'underline'],
    ['blockquote'],
    [{
        'header': 1
    }, {
        'header': 2
    }],
    [{
        'indent': '-1'
    }, {
        'indent': '+1'
    }],
    [{
        'align': []
    }],
];


const loadNote = (e) => {
    for (var i = 0; i < document.querySelectorAll('.uneFeuille').length; i++) {
        document.querySelectorAll('.uneFeuille')[i].style.color = "black";
    }
    quill = new Quill('#activeNote', {
        theme: 'bubble',
        placeholder: 'Ecris...',
        modules: {
            toolbar: toolbarOptions
        }
    });
    idbEcris.get(e.id).then((res) => {
        document.querySelector('.ql-editor').innerHTML = res;
        e.style.color = "#5770BE";
        activeNote = e.id;
        quill.on('text-change', () => {
            SlowNoteToMem();
        });
        //document.querySelector('#btnNvElem').style.display = 'block';
    })
};

const uniquedivid = () => {
    if (localStorage.getItem('uniqueID') == null) localStorage.setItem('uniqueID', 2);
    let ii = localStorage.getItem('uniqueID');
    ii++;
    localStorage.setItem('uniqueID', ii);
    return ii;
};

const newLine = () => {
    document.getSelection().baseNode.insertAdjacentHTML("afterend", '<div></div>');
    toContEditEnd(document.getSelection().baseNode.nextElementSibling);
};

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
};

const toutSuppr = () => {
    idbEcris.clear().then(() => {
        updateLists();
        document.querySelector("#activeNote").innerHTML = '';
        document.querySelector("#activeNote").setAttribute("contenteditable", false)
    })
};

const importerNotes = (e) => {
    var reader = new FileReader();
    reader.onload = (event) => {
        let notesImportees = JSON.parse(event.target.result);
        let compteur = 0;
        for (laNote in notesImportees) {
            idbEcris.set(laNote, notesImportees[laNote]).then(() => {
                compteur++;
                if (compteur == Object.keys(notesImportees).length) updateLists()
            });
        }
    }
    reader.readAsText(e)
};

const exportNotes = () => {
    let objectForExport = {};
    idbEcris.keys().then((ee) => {
        for (ie in ee) {
            (async () => {
                let indexObj = ee[ie];
                let contenu = await idbEcris.get(indexObj).then((aa) => {
                    return (aa);
                });
                objectForExport[indexObj] = contenu;
                if (indexObj == ee.slice(-1)[0]) {
                    download("mes_notes.txt", JSON.stringify(objectForExport));
                }
            })();
        }
    });
};

let dictReplace = {
    "[xx]": "<input type='checkbox' class='ecrCheckbox' onchange='ectCheckbox(this)'>",
    ".suppr": "<button class='btnSuppr drag-box' contenteditable='false' onclick='supprLaNote()'> Supprimer la note. </button>",
    ".toutsuppr": "<button class='btnSuppr drag-box' contenteditable='false' onclick='toutSuppr()'> Supprimer toutes données. </button>",
    ".tableau": "<div style='position:relative; width:fit-content;'><table class='tableEcr'><tr contenteditable='true'><th>Lastname</th><th>Age</th></tr><tr contenteditable='true'><td>Wayne</td><td>50</td></tr><tr contenteditable='true'><td>Jackson</td><td>94</td></tr></table><div class='newColRowbtn' contenteditable='false' onclick='newRow(this)' style='top:0px;right:-25px;'>+</div><div class='newColRowbtn' contenteditable='false' onclick='newCol(this)' style='left:0px;bottom:-25px;'>+</div></div><div><br></div>",
    ".dessin": "<svg class='ecrDrawboard' id='drwboard-_-' width='100%' height='400px' preserveAspectRatio='xMinYMin meet'/><button contenteditable='false' class='btnAnnuler' onclick='try{document.querySelector(\"#drwboard-_-\").lastElementChild.remove()}catch{};SlowNoteToMem();'>↺</button><div></br></div> <img src='assets/blnk.gif' onload='var ecrDessin1 = new Scribby(document.querySelector(\"#drwboard-_-\"));'/> "
}

let timeout = null;
const SlowNoteToMem = () => {
    clearTimeout(timeout);
    timeout = setTimeout(function () {
        NoteToMemory();
    }, 1000);
}

document.querySelector("#activeNote").addEventListener('keyup', event => {
    if (Object.keys(dictReplace).some(v => String(document.getSelection().baseNode.textContent).includes(v))) {
        let textAvant = String(document.getSelection().baseNode.parentElement.innerHTML)
        for (expr in dictReplace) {
            textAvant = textAvant.replace(expr, dictReplace[expr])
        }
        document.getSelection().baseNode.parentElement.innerHTML = textAvant.replaceAll("-_-", uniquedivid());
        //newLine();
    };
    SlowNoteToMem();
});

document.querySelector("#activeNote").addEventListener('keydown', event => {
    //TABKEY if (event.keyCode == 9) document.getSelection().baseNode.parentElement.insertAdjacentHTML("afterbegin", "<span class='tabSpace'></span>")
    // let currentWr = document.getSelection().baseNode.parentElement.innerHTML
    // document.getSelection().baseNode.parentElement.innerHTML = currentWr.replaceAll("-->", "&#129058;").replaceAll('=>', '&#8658;')
    // if (["•", "-", "&gt;"].includes(currentWr.split(' ')[0]) && event.keyCode == 13) {
    //     event.preventDefault();
    //     document.getSelection().baseNode.parentElement.insertAdjacentHTML("afterend", "<div>" + currentWr.split(' ')[0] + "&nbsp;</div>");
    //     toContEditEnd(document.getSelection().baseNode.parentElement.nextSibling);
    // }
    SlowNoteToMem();
});

document.querySelector("#newNote").addEventListener('keyup', event => {
    let valeurNouvelleNote = document.querySelector("#newNote").value
    if (event.key == "Enter" && valeurNouvelleNote != "") {
        if (["importer", "import"].includes(valeurNouvelleNote.toLowerCase())) {
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
            idbEcris.set(valeurNouvelleNote, "<div><br></div>").then(e => {
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