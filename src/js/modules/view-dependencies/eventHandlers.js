import { Visual } from "../../Controller.js";

// ================================================================================================

// listen to the blur event on all inputs inside the form: if it happens change styles on label el
function listenToBlur() {
    const allFormInputs = [...Visual.formEl.querySelectorAll(".journal__form-input")];
    allFormInputs.forEach((inputEl) => {
        inputEl.addEventListener("blur", function (e) {
            const blurredEl = e.target;
            if (blurredEl.value.length > 0) {
                blurredEl.nextElementSibling.classList.add("moved-up");
            } else {
                blurredEl.nextElementSibling.classList.remove("moved-up");
            }
        });
    });
}

// ================================================================================================

export { listenToBlur };
