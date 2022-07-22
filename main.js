console.log("-- init --");

const panel = $("<div>", { id: "auto-panel" }).appendTo("body");

class MiTimer {
  constructor(options) {
    this.name = options.name;
    this.interval = options.interval;
    this.target = options.target;
    this.action = options.action?.bind(this);
    this.timerId = null;
  }

  init = () => {
    $(`<button>${this.label("off")}</button>`, {
      id: this.name
    })
      .click(() => {
        console.log(`onclick ${this.name}`);
        if (!this.timerId) this.start();
        else this.end();
      })
      .appendTo(panel);
  };

  label = (state) => `${this.name}: ${state}`;

  tryAction = () => {
    try {
      this.action();
    } catch (error) {
      console.error(error);
      this.end();
    }
  };

  start = () => {
    console.log(`start ${this.name}`);
    if (this.timerId) {
      return;
    }

    $(`#${this.name}`).html(this.label("on"));

    this.tryAction();
    this.timerId = setInterval(() => {
      this.tryAction();
    }, this.interval);
  };

  end = () => {
    console.log(`end ${this.name}`);

    $(`#${this.name}`).html(this.label("off"));

    clearInterval(this.timerId);
    this.timerId = null;
  };
}

const actions = {
  click: (target) => {
    console.log("action click", target);
    $(target).click();
  }
};

const timers = [
  new MiTimer({
    name: "點燃篝火",
    interval: 5000,
    action: () => actions.click("#firemaking-bonfire-button")
  })
];
timers.forEach((timer) => timer.init());
