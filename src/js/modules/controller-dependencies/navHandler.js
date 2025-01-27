import { Logic, Visual } from "../../Controller.js";

// handle clicks in the .header section (btns Add New and View All)
function navHandler(clickedEl) {
    const clickedElText = clickedEl.textContent;
    clickedEl.classList.add("active"); // visual highlighting

    if (clickedElText === "Add New") {
        // show form, hide all
        clickedEl.nextElementSibling.classList.remove("active");
        Visual.toggleFormNotes("form");
        Visual.removeMessages();
    } else {
        // show all, hide form
        clickedEl.previousElementSibling.classList.remove("active");
        Visual.toggleFormNotes("all notes");
        Visual.clearAllNotes(); // clearing all before re-rendering them

        const allNotesCopy = JSON.parse(JSON.stringify(Logic.getStateNotes())).reverse(); // reversing the order of notes: all the new ones will be at the top

        if (allNotesCopy.length === 0) {
            Visual.showMessage("notification", "Nothing here yet...");
            Visual.toggleAllEntriesElements("hide"); // toggling the visibility of .search and .all-entries__box
        } else {
            Visual.removeMessages();
            Visual.toggleAllEntriesElements("show"); // hiding/showing 2 sections
            const allNoteTitles = allNotesCopy.map((noteObj) => noteObj.title);
            const allNoteIds = allNotesCopy.map((noteObj) => noteObj.id);
            const allContentIds = allNotesCopy.map((noteObj) => noteObj.note.slice(0, 50));
            Visual.renderEntriesBrowser(allNoteTitles, allNoteIds, allContentIds); // rendering all miniatures
            allNotesCopy.forEach((noteObj) => Visual.renderNote(noteObj)); // rendering all notes
            const notesNum = Logic.getStateNotes().length;
            Visual.updateSearchPlaceholder(notesNum); // updating the placeholder (search form) to show how many notes there are
        }
    }
}

export default navHandler;
