// Model is responsible for all logic in the app: all computations, calculations, and data operations

class Model {
    #state = {};

    constructor() {
        this.timer = "";
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
        return [year, month, date, hours, minutes, seconds];
    }

    // ================================================================================================

    setNowTime() {
        const [year, month, date, hours, minutes] = this.getCurrentTime();
        this.#state.refreshTime = [year, month, date, hours, minutes];
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
}

export default Model;
