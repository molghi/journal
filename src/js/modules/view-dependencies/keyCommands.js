import { Visual } from "../../Controller.js";

function listenKeyPresses(handler) {
    document.addEventListener("keydown", function (e) {
        // 'keypress' is deprecated

        if ((e.metaKey && e.key === "Enter") || (e.ctrlKey && e.key === "Enter")) {
            if (Visual.journalFormSection.classList.contains("hidden")) return;
            handler("submit");
        }

        // if (e.code === "KeyZ") {
        //     const newCol = prompt("Enter a new UI colour:");
        //     if (!newCol) return;
        //     document.documentElement.style.setProperty("--accent", newCol); // changing the accent colour
        //     console.log(`UI accent colour now: ${newCol}`);
        // }
    });
}

export default listenKeyPresses;
