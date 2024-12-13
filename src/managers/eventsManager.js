class EventsManager {
  constructor() {
    this.keys = {
      w: { pressed: false },
      a: { pressed: false },
      s: { pressed: false },
      d: { pressed: false },
      e: { pressed: false },
      " ": { pressed: false },
    };

    this.preventInput = false;

    window.addEventListener("keydown", this.onKeyDown.bind(this));
    window.addEventListener("keyup", this.onKeyUp.bind(this));
  }

  onKeyDown(event) {
    if (this.preventInput) return;
    const key = event.key.toLowerCase();
    if (
      key === "w" ||
      key === "a" ||
      key === "s" ||
      key === "d" ||
      key === "e" ||
      key === " "
    ) {
      this.keys[key].pressed = true;
    }
  }

  onKeyUp(event) {
    if (this.preventInput) return;
    const key = event.key.toLowerCase();
    if (
      key === "w" ||
      key === "a" ||
      key === "s" ||
      key === "d" ||
      key === "e" ||
      key === " "
    ) {
      this.keys[key].pressed = false;
    }
  }
}

const eventsManager = new EventsManager();
