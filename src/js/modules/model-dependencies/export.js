import { Logic } from "../../Controller.js";

// exporting as .json
function exportNotesJson() {
    const data = Logic.getStateNotes();
    const [year, month, date, hours, minutes, seconds] = Logic.getCurrentTime();

    const filename = `my-notes--${date}-${month}-${year.toString().slice(2)}--${hours}-${minutes}.json`;

    const json = JSON.stringify(data, null, 2); // Converting data to JSON: Converts the JavaScript object 'data' into a formatted JSON string. The 'null, 2' arguments ensure the output is pretty-printed with 2-space indentation for readability.
    const blob = new Blob([json], { type: "application/json" }); // Creating a blob: Creates a binary large object (Blob) containing the JSON string, specifying the MIME type as 'application/json' to ensure it's recognised as a JSON file.
    const url = URL.createObjectURL(blob); // Creating a download URL: Generates a temporary URL pointing to the Blob, enabling it to be downloaded as a file by associating it with a download link.

    // Create an invisible anchor element for downloading
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url); // Clean up the URL
}

// ================================================================================================

// exporting as .txt
function exportNotesTxt() {
    const data = prepareForExport();
    const [year, month, date, hours, minutes, seconds] = Logic.getCurrentTime();

    const filename = `my-notes--${date}-${month}-${year.toString().slice(2)}--${hours}-${minutes}.txt`;

    const blob = new Blob([data], { type: "text/plain" }); // Create a Blob with the content and specify text/plain MIME type

    const anchor = document.createElement("a"); // Create a temporary anchor element
    anchor.href = URL.createObjectURL(blob); // Create an object URL for the Blob
    anchor.download = filename; // Set the filename for download

    anchor.click(); // Trigger the download

    URL.revokeObjectURL(anchor.href); // Clean up the object URL
}

// ================================================================================================

// dependency of 'exportNotesTxt' -- preparing notes to be exported as .txt
function prepareForExport() {
    const separator = `---------------------------------------------------------------------`;
    const result = Logic.getStateNotes().map((noteObj) => {
        const trueTime = new Date(noteObj.time);
        const trueDate = `${trueTime.getDate()}/${trueTime.getMonth() + 1}/${trueTime.getFullYear().toString().slice(2)}`;
        const keywords = !noteObj.keywords
            ? ""
            : !Array.isArray(noteObj.keywords)
            ? `Keywords: ${noteObj.keywords}\n\n`
            : `Keywords: ${noteObj.keywords.join(", ")}\n\n`;
        return `${noteObj.title}\n\n${noteObj.note.replaceAll("<br>", "\n")}\n\n${keywords}Date: ${
            noteObj.dateInput
        }  (${trueDate})\n\n\n${separator}\n\n\n`;
    });
    const notesNum = result.length;
    result.unshift(`Your Notes (${notesNum})\n\n\n`, separator + "\n\n\n");
    return result.join("");
}

// ================================================================================================

export { exportNotesJson, exportNotesTxt };
