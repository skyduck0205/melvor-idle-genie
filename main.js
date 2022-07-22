console.log('-- init --');

const panel = $('<div>', { id: 'auto-panel' }).appendTo('body');

class MiTimer {
  constructor(options) {
    this.name = options.name;
    this.interval = options.interval;
    this.target = options.target;
    this.action = options.action?.bind(this);
    this.timerId = null;
  }

  init = () => {
    $(`<button>${this.label('off')}</button>`)
      .attr({
        id: this.name,
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

    $(`#${this.name}`).text(this.label('on'));

    this.tryAction();
    this.timerId = setInterval(() => {
      this.tryAction();
    }, this.interval);
  };

  end = () => {
    console.log(`end ${this.name}`);

    $(`#${this.name}`).text(this.label('off'));

    clearInterval(this.timerId);
    this.timerId = null;
  };
}

const actions = {
  click: (target) => {
    console.log('action click', target);
    $(target).click();
  },
};

const timers = [
  new MiTimer({
    name: 'auto篝火',
    interval: 5000,
    action: function () {
      actions.click('#firemaking-bonfire-button');
    },
  }),
  new MiTimer({
    name: 'auto戰鬥',
    interval: 2000,
    action: function () {
      // pick item
      const n = +$('#combat-loot-text')
        .text()
        .replace(/\D+(\d+) \/.*/, '$1');
      if (n > 90) {
        console.log('pick items:', n);
        $('#combat-btn-loot-all').click();
      }
      // eat
      const cur = +$('#combat-player-hitpoints-current').text();
      const max = +$('#combat-player-hitpoints-max').text();
      const food = +$('#combat-food-container .combat-food + span')
        .first()
        .text()
        .replace(' HP', '');
      console.log('lost:', max - cur, 'food:', food);
      if (Number.isNaN(food)) {
        console.log('food empty, escape');
        $('#combat-btn-run').click();
        return this.end();
      }
      if (max - cur > food) {
        console.log('eat:+', food);
        $('#combat-food-container button').first().click();
      }
    },
  }),
];
timers.forEach((timer) => timer.init());
