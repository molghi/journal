// Controller is the grand orchestrator of the entire project: it initialises Model, View, and uses all methods defined there to perform all actions.

"use strict";

import "../styles/main.scss";
// import myImageNameWithoutExtension from '../img/myImageNameWithExtension'  // myImageNameWithoutExtension will be the src

// instantiating main classes
import Model from "./modules/Model.js";
import View from "./modules/View.js";
const Logic = new Model();
const Visual = new View();

// ================================================================================================

// runs on app start
function init() {
    const [year, month, date, hours, minutes] = Logic.getCurrentTime(); // getting now time
    Visual.renderTimeElement(year, month, date, hours, minutes); // rendering time element (bottom left)
    Visual.renderFormDateEl(year, month, date); // rendering date input in form

    Logic.tickTime(Visual.renderTimeElement); // updating time every 60 seconds

    runEventListeners();
}
init();

// ================================================================================================

// running event listeners
function runEventListeners() {
    Visual.listenToBlur();
}

// ================================================================================================

// exporting for some dependencies
export { Logic, Visual, runEventListeners };
