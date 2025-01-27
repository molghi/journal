import { Logic, Visual } from "../../Controller.js";

// handle the actions menu: Change color, Export notes, Import notes
function actionsHandler(typeOfAction) {
    if (typeOfAction === "change color") {
        // changing the accent color

        const newColor = Visual.promptAccentChange();
        if (!newColor) return;
        if (newColor && newColor.trim().length < 3) return;
        const checkedColor = Logic.checkNewColor(newColor);
        Visual.setAccentColor(checkedColor); // changing visually
        Logic.setAccentColor(checkedColor); // changing in state and LS
    } else if (typeOfAction === "export notes") {
        // exporting notes

        let answer = prompt(`Choose the format: TXT or JSON?
    JSON: bad for reading, good for importing
    TXT: good for reading, bad for importing`); // prompting
        if (!answer) return;
        answer = answer.toLowerCase().trim();
        if (answer !== "txt" && answer !== "json") return;
        answer === "json" ? Logic.exportNotesJson() : Logic.exportNotesTxt(); // exporting as JSON or TXT
    } else if (typeOfAction === "import notes") {
        // importing notes

        alert(`NOTE:\nYou can import only JSON and it must be formatted exactly the same as the one you can export.`);
        Visual.fileInputEl.click(); // clicking the file import btn automatically, everything after that happens in the 'change' event listener
    }
}

export default actionsHandler;
