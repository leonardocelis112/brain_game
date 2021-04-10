const config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  scene: {
    preload: preload,
    create: create,
    update: update,
  },
};

const gameConfig = {
  meteorScale: 0.09,
  numberOfMeteors: 7,
  gameType: "A",
  grid: new Array(8).fill(0).map(() => new Array(6).fill(0)),
};

const timeElement = document.getElementById("time-text");
const restartBtn = document.getElementById("restart-btn");
restartBtn.addEventListener("click", restart);
let timer;
let game;
let timeInSeconds = 0;
let timerOn = false;

game = new Phaser.Game(config);
const meteors = [];

function preload() {
  this.load.image("starfield", "assets/starfield.png");
  this.load.image("meteor", "assets/meteor.png");
}

function create() {
  this.add.image(0, 0, "starfield").setOrigin(0, 0);
  for (let i = 0; i < gameConfig.numberOfMeteors; i++) {
    const randomCoords = generateNonInclusiveRandom();
    const meteor = this.add
      .sprite(randomCoords.x, randomCoords.y, "meteor")
      .setOrigin(0, 0);
    meteor.setInteractive({ cursor: "pointer" });
    meteor.setScale(gameConfig.meteorScale);

    const style = {
      font: "30px Arial",
      fill: "#FFFFFF",
      wordWrap: true,
      fontWeight: "bold",
      wordWrapWidth: meteor.width,
      align: "center",
    };

    const text = this.add
      .text(randomCoords.x + 40, randomCoords.y + 35, `${i + 1}`, style)
      .setOrigin(0, 0);
    meteors.push({
      meteor,
      text: text,
      x: randomCoords.x,
      y: randomCoords.y,
      id: i,
    });

    meteor.on(
      Phaser.Input.Events.POINTER_UP,
      () => {
        destroyBubble(meteor, text, i);
      },
      this
    );
  }
}

function update() {}

function destroyBubble(sprite, text, id) {
  if (!timerOn) {
    timer = setInterval(updateTime, 1000);
    timerOn = true;
  }

  sprite.destroy();
  text.destroy();

  const index = meteors.findIndex((meteor) => meteor.id === id);

  meteors.splice(index, 1);
  console.log(meteors);

  if (meteors.length === 0) {
    clearInterval(timer);
    timerOn = false;
  }
}

function updateTime() {
  timeInSeconds += 1;
  timeElement.innerHTML = `Tiempo : ${timeInSeconds} segundos`;
}

function restart() {
  gameConfig.grid = new Array(8).fill(0).map(() => new Array(6).fill(0));
  timeInSeconds = 0;
  game.destroy(true);
  game = new Phaser.Game(config);
}

function generateNonInclusiveRandom() {
  const x = parseInt(Math.random() * (8 - 0));
  const y = parseInt(Math.random() * (6 - 0));

  if (gameConfig.grid[x][y] === 1) {
    return generateNonInclusiveRandom();
  } else {
    gameConfig.grid[x][y] = 1;
    return { x: x * 100, y: y * 100 };
  }
}
