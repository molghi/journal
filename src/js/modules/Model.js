// Model is responsible for all logic in the app: all computations, calculations, and data operations

import { NULL } from "sass";

// importing dependencies:
import LS from "./model-dependencies/localStorage.js";
import { exportNotesJson, exportNotesTxt } from "./model-dependencies/export.js";

class Model {
    #state = {
        notes: [],
        accentColor: "green",
    };

    constructor() {
        this.timer = "";
        this.getNotes(); // fetching from LS
        this.fetchAccentColor(); // fetching from LS and updating only the state
    }

    // ================================================================================================

    getState = () => this.#state;

    getRefreshTime = () => this.#state.refreshTime;

    getStateNotes = () => this.#state.notes;

    getAccentColor = () => this.#state.accentColor;

    // ================================================================================================

    saveNotesToLS() {
        LS.save("myJournal", this.#state.notes, "reference"); // push to LS a reference type
    }

    // ================================================================================================

    getCurrentTime() {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth() + 1;
        const date = now.getDate();
        const hours = now.getHours();
        const minutes = now.getMinutes().toString().padStart(2, 0);
        const seconds = now.getSeconds();
        this.#state.refreshTime = [year, month, date, hours, minutes];
        return [year, month, date, hours, minutes, seconds];
    }

    // ================================================================================================

    // to change the time el every 60 seconds
    tickTime(handler) {
        if (this.timer) clearInterval(this.timer);

        this.timer = setInterval(() => {
            const [year, month, date, hours, minutes, seconds] = this.getCurrentTime();
            handler(year, month, date, hours, minutes, seconds);
        }, 60000); // every 60 sec
    }

    // ================================================================================================

    // adding a new note to the state and LS
    addNote(dateInput, keywordsInput, titleInput, textareaInput) {
        const newNote = {};
        newNote.time = new Date().toISOString();
        newNote.id = Date.now();
        newNote.keywords = !keywordsInput.includes(",") ? keywordsInput.trim() : keywordsInput.split(",").map((x) => x.trim());
        newNote.dateInput = dateInput.trim();
        newNote.title = titleInput.trim() || "Journal Entry";
        newNote.note = textareaInput.trim().replaceAll("\n", "<br>");
        this.#state.notes.push(newNote);
        console.log(this.#state.notes);
        this.saveNotesToLS();
    }

    // ================================================================================================

    // returns boolean (isInputOk) and message (if there was error)
    validateInput(arr) {
        const [dateInput, keywordsInput, titleInput, textareaInput] = arr;
        // so if the date input was empty, I put there the today date -- but if it was filled, it can take only digits, dots or slashes, nothing else
        const validDateInput = /^[\d./]+$/.test(dateInput); // \d matches any digit (0–9).  . matches a literal dot.  / matches a literal slash.  + ensures one or more of the allowed characters are present.  ^ asserts the start of the string.  $ asserts the end of the string.
        if (!validDateInput) return [false, "Date input can take only digits, dots or slashes. No letters."];
        // if the keywords input was empty, okay, it can be empty -- but if it was filled, it can be one word or words separated by commas
        // if the title input was empty, I put there "Journal Entry"
        // textarea cannot be empty
        if (!textareaInput.trim()) return [false, "You cannot submit an empty note."];
        return [true, null];
    }

    // ================================================================================================

    getTodayString() {
        const [year, month, date] = this.getCurrentTime();
        return `${date}/${month}/${year.toString().slice(2)}`;
    }

    // ================================================================================================

    // get from LS
    getNotes() {
        const fetched = LS.get("myJournal", "reference");
        if (!fetched) return;
        fetched.forEach((noteObj) => this.#state.notes.push(noteObj));
    }

    // ================================================================================================

    deleteNote(id) {
        const index = this.#state.notes.findIndex((note) => note.id === +id);
        if (index < 0) return;
        this.#state.notes.splice(index, 1);
        this.saveNotesToLS();
    }

    // ================================================================================================

    editNote(editWhat, noteId, newValue) {
        const index = this.#state.notes.findIndex((note) => note.id === +noteId);
        if (index < 0) return;
        if (editWhat === "title") {
            this.#state.notes[index].title = newValue;
        }
        if (editWhat === "text") {
            this.#state.notes[index].note = newValue;
        }
        if (editWhat === "keywords") {
            const newKeywords = !newValue.includes(",") ? newValue : newValue.split(",").map((x) => x.trim());
            this.#state.notes[index].keywords = newKeywords;
        }
        this.saveNotesToLS();
        if (editWhat === "keywords") return this.#state.notes[index].keywords; // returning to re-render
    }

    // ================================================================================================

    // get the text (the note body itself) of some note
    getNoteText(noteId) {
        const index = this.#state.notes.findIndex((note) => note.id === +noteId);
        if (index < 0) return;
        return this.#state.notes[index].note;
    }

    // ================================================================================================

    // checking the input accent color
    checkNewColor(newColor) {
        // mimicking DOM addition to get the computed color
        const span = document.createElement("span");
        document.body.appendChild(span);
        span.style.color = newColor;
        let color = window.getComputedStyle(span).color;
        document.body.removeChild(span);

        const rgbValues = color
            .slice(4, -1)
            .split(",")
            .map((x) => +x.trim()); // just the rgb values (r,g,b)

        if (rgbValues[0] < 40 && rgbValues[1] < 40 && rgbValues[2] < 40) return `rgb(0, 128, 0)`; // return green if it is too dark

        return color;
    }

    // ================================================================================================

    // setting new accent color
    setAccentColor(color) {
        this.#state.accentColor = color;
        LS.save("myJournalAccentColor", this.#state.accentColor, "prim"); // push to LS a primitive type
    }

    // ================================================================================================

    // getting the accent color from LS
    fetchAccentColor() {
        const fetched = LS.get("myJournalAccentColor", "prim");
        if (!fetched) return;
        this.#state.accentColor = fetched;
    }

    // ================================================================================================

    // exporting as .json
    exportNotesJson() {
        exportNotesJson();
    }

    // ================================================================================================

    // exporting as .txt
    exportNotesTxt() {
        exportNotesTxt();
    }

    // ================================================================================================

    defineYearTime(monthNum) {
        switch (monthNum) {
            case 12:
            case 1:
            case 2:
                return "Winter";
            case 3:
            case 4:
            case 5:
                return "Spring";
            case 6:
            case 7:
            case 8:
                return "Summer";
            case 9:
            case 10:
            case 11:
                return "Autumn";
            default:
                return null;
        }
    }

    // ================================================================================================

    // getting the keywords of some note by its id
    getKeywords(noteId) {
        const index = this.#state.notes.findIndex((note) => note.id === +noteId);
        return this.#state.notes[index].keywords;
    }

    // ================================================================================================

    // filtering notes: happens upon submitting the search field
    filterNotes(inputValue) {
        const searchByContent = this.#state.notes.filter((noteObj) =>
            noteObj.note.toLowerCase().includes(inputValue.toLowerCase())
        );
        const searchByDate = this.#state.notes.filter((noteObj) =>
            noteObj.dateInput.toLowerCase().includes(inputValue.toLowerCase())
        );
        const searchByKeywords = this.#state.notes.filter((noteObj) => {
            const keywordsIsArray = Array.isArray(noteObj.keywords);
            if (keywordsIsArray) return noteObj.keywords.map((key) => key.toLowerCase()).includes(inputValue.toLowerCase());
            else noteObj.keywords.toLowerCase().includes(inputValue.toLowerCase());
        });
        const searchByTitle = this.#state.notes.filter((noteObj) =>
            noteObj.title.toLowerCase().includes(inputValue.toLowerCase())
        );
        const allFindings = [...searchByContent, ...searchByDate, ...searchByKeywords, ...searchByTitle];
        const allFindingsIds = [...new Set(allFindings.map((noteObj) => noteObj.id))];
        return allFindingsIds;
    }

    // ================================================================================================
}

export default Model;
