import { Visual } from "../../Controller.js";

function listenKeyPresses(handler) {
    document.addEventListener("keydown", function (e) {
        // 'keypress' is deprecated

        if ((e.metaKey && e.key === "Enter") || (e.ctrlKey && e.key === "Enter")) {
            // cmd+enter submits the note in Add New
            if (Visual.journalFormSection.classList.contains("hidden")) return; // but if that form is hidden, return
            handler("submit");
        }
    });
}

export default listenKeyPresses;
