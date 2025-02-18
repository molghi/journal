import { Visual } from "../../Controller.js";

function listenKeyPresses(handler) {
    document.addEventListener("keydown", function (e) {
        // 'keypress' is deprecated

        if ((e.metaKey && e.key === "Enter") || (e.ctrlKey && e.key === "Enter")) {
            // cmd+enter submits the note in Add New
            if (Visual.journalFormSection.classList.contains("hidden")) return; // but if that form is hidden, return
            handler("submit");
        }

        // if (e.key === "Enter") {
        //     if (!document.querySelector(".textarea-edit")) return;
        //     handler(`edit textarea enter`); // listening to pressing Enter while in editing mode with textarea: its height must increase upon pressing Enter
        // }
        // if (e.key === "Backspace") {
        //     if (!document.querySelector(".textarea-edit")) return;
        //     handler(`edit textarea backspace`); // listening to pressing Delete while in editing mode with textarea: its height must decrease upon pressing Delete
        // }
    });
}

export default listenKeyPresses;
