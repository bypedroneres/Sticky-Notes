let noteId = 0;
let occupiedPositions = [];

function createStickyNote() {
    const container = document.getElementById("container");
    const note = document.createElement("div");
    note.className = "note";
    note.id = "note_" + noteId;
    note.innerHTML = `
        <div class="header">
            <span class="delete" onclick="deleteStickyNote('${note.id}')">Delete</span>
        </div>
        <div class="content" contenteditable="true" onclick="hidePlaceholder(this)">Click and type here!</div>
        <input type="color" class="color-picker" onchange="changeNoteColor('${note.id}', this.value)">
    `
     saveNotesToLocalStorage();

    noteId++;
    note.addEventListener("mousedown", startDrag);
    container.appendChild(note);
    saveNotesToLocalStorage();
}

function hidePlaceholder(element) {
    if (element.innerText === "Click and type here!") {
        element.innerText = "";
       saveNotesToLocalStorage();
    }
}

function startDrag(event) {
    const note = event.target;
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    const noteX = note.offsetLeft;
    const noteY = note.offsetTop;
    const offsetX = mouseX - noteX;
    const offsetY = mouseY - noteY;

    document.addEventListener("mousemove", dragNote);
    document.addEventListener("mouseup", stopDrag);
    saveNotesToLocalStorage();

    function dragNote(event) {
        if (event.target.tagName.toLowerCase() === 'input' || event.target.tagName.toLowerCase() === 'textarea') {
            return; // Prevent dragging if the target is an input element
        }
        event.preventDefault(); // Prevent text selection
        const newNoteX = event.clientX - offsetX;
        const newNoteY = event.clientY - offsetY;
        note.style.left = newNoteX + "px";
        note.style.top = newNoteY + "px";
        saveNotesToLocalStorage();
    }

    function stopDrag() {
        document.removeEventListener("mousemove", dragNote);
        document.removeEventListener("mouseup", stopDrag);
        saveNotesToLocalStorage();
    }
}

function deleteStickyNote(noteId) {
    const deleteButton = event.target;
    if (deleteButton.classList.contains("delete")) {
        const note = deleteButton.parentNode.parentNode;
        note.remove();
        saveNotesToLocalStorage();
    }
}

function resetNotes() {
    const container = document.getElementById("container");
    container.innerHTML = "";
    noteId = 0;
    occupiedPositions = [];
    localStorage.removeItem("stickyNotes");
    saveNotesToLocalStorage();
}

function saveNotesToLocalStorage() {
    const notes = document.getElementsByClassName("note");
    const notesArray = Array.from(notes).map(note => ({
        id: note.id,
        content: note.querySelector(".content").innerText,
        top: note.style.top,
        left: note.style.left,
        color: note.querySelector(".color-picker").value // Retrieve color value from the color picker
    }));
    localStorage.setItem("stickyNotes", JSON.stringify(notesArray));
}

function loadNotesFromLocalStorage() {
    const savedNotes = localStorage.getItem("stickyNotes");
    if (savedNotes) {
        const notesArray = JSON.parse(savedNotes);
        notesArray.forEach(note => {
            const container = document.getElementById("container");
            const newNote = document.createElement("div");
            newNote.className = "note";
            newNote.id = note.id;
            newNote.innerHTML = `
                <div class="header">
                    <button class="delete" onclick="deleteStickyNote('${note.id}')" contenteditable="false">Delete</button>
                </div>
                <div class="content" contenteditable="true">${note.content}</div>
                <input type="color" class="color-picker" onchange="changeNoteColor('${note.id}', this.value)" value="${note.color}">
            `;
            newNote.style.top = note.top;
            newNote.style.left = note.left;
            newNote.style.backgroundColor = note.color; // Set background color
            newNote.addEventListener("mousedown", startDrag);
            container.appendChild(newNote);
        });
    }
}

function changeNoteColor(noteId, color) {
    const note = document.getElementById(noteId);
    note.style.backgroundColor = color;
    saveNotesToLocalStorage();
}

window.addEventListener("DOMContentLoaded", loadNotesFromLocalStorage);

