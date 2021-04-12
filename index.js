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

const timeElement = document.getElementById("time-text");
const restartBtn = document.getElementById("restart-btn");
const numberOfMeteors = document.getElementById("number-of-meteors");
const gameType = document.getElementById("game-type");

const gameConfig = {
  meteorScale: 0.2,
  numberOfMeteors: numberOfMeteors.value,
  gameType: gameType.value,
  grid: new Array(8).fill(0).map(() => new Array(6).fill(0)),
};

restartBtn.addEventListener("click", restart);
let timer;
let game;
let timeInSeconds = 0;
let timerOn = false;
let sequence = [];

game = new Phaser.Game(config);
let meteors = [];

function preload() {
  this.load.image("meteor", "assets/meteor.png");
}

function create() {
  meteors = [];
  this.cameras.main.backgroundColor.setTo(255, 255, 255);
  generateSequence(gameConfig.gameType);
  const style = {
    font: "30px Arial",
    fill: "#000000",
    wordWrap: true,
    fontWeight: "bold",
    wordWrapWidth: 0,
    align: "center",
  };
  const wordsArray = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "Ñ",
    "O",
    "P",
    "Q",
  ];

  for (let i = 0; i < gameConfig.numberOfMeteors; i++) {
    let randomCoords;

    if (gameConfig.gameType === "B") {
      randomCoords = generateNonInclusiveRandom();
      const meteorNumber = this.add
        .sprite(randomCoords.x, randomCoords.y, "meteor")
        .setOrigin(0, 0);
      meteorNumber.setInteractive({ cursor: "pointer" });
      meteorNumber.setScale(gameConfig.meteorScale);
      style.wordWrapWidth = meteorNumber.width;
      const text = this.add
        .text(randomCoords.x + 40, randomCoords.y + 35, `${i + 1}`, style)
        .setOrigin(0, 0);
      meteors.push({
        meteorNumber,
        text: `${i + 1}`,
        x: randomCoords.x,
        y: randomCoords.y,
        index: i,
      });
      meteorNumber.on(
        Phaser.Input.Events.POINTER_UP,
        () => {
          destroyBubble(meteorNumber, `${i + 1}`, text, i);
        },
        this
      );

      randomCoords = generateNonInclusiveRandom();
      const meteorText = this.add
        .sprite(randomCoords.x, randomCoords.y, "meteor")
        .setOrigin(0, 0);
      meteorText.setInteractive({ cursor: "pointer" });
      meteorText.setScale(gameConfig.meteorScale);

      const letter = wordsArray.shift();
      const textLetter = this.add
        .text(randomCoords.x + 40, randomCoords.y + 35, `${letter}`, style)
        .setOrigin(0, 0);

      meteors.push({
        meteorText,
        text: `${letter}`,
        x: randomCoords.x,
        y: randomCoords.y,
        index: i,
      });

      meteorText.on(
        Phaser.Input.Events.POINTER_UP,
        () => {
          destroyBubble(meteorText, `${letter}`, textLetter, i);
        },
        this
      );
    } else {
      randomCoords = generateNonInclusiveRandom();
      const meteor = this.add
        .sprite(randomCoords.x, randomCoords.y, "meteor")
        .setOrigin(0, 0);
      meteor.setInteractive({ cursor: "pointer" });
      meteor.setScale(gameConfig.meteorScale);
      const style = {
        font: "30px Arial",
        fill: "#000000",
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
        text: `${i + 1}`,
        x: randomCoords.x,
        y: randomCoords.y,
        index: i,
      });
      meteor.on(
        Phaser.Input.Events.POINTER_UP,
        () => {
          destroyBubble(meteor, `${i + 1}`, text, i);
        },
        this
      );
    }
  }
}

function update() {}

function destroyBubble(sprite, textContent, textSprite, meteorIndex) {
  if (!timerOn) {
    timer = setInterval(updateTime, 1000);
    timerOn = true;
  }

  const index = meteors.findIndex((meteor) => meteor.index === meteorIndex);

  if (sequence[0].toString() === textContent) {
    sequence.shift();
    sprite.destroy();
    textSprite.destroy();
    meteors.splice(index, 1);
  }

  if (meteors.length === 0) {
    clearInterval(timer);
    timerOn = false;
    alert(`Tu tiempo fue de: ${timeInSeconds} segundos`);
  }
}

function updateTime() {
  timeInSeconds += 1;
  timeElement.innerHTML = `Tiempo : ${timeInSeconds} segundos`;
}

function restart() {
  gameConfig.grid = new Array(8).fill(0).map(() => new Array(6).fill(0));
  gameConfig.gameType = gameType.value;
  gameConfig.numberOfMeteors = numberOfMeteors.value;
  clearInterval(timer);
  timeInSeconds = 0;
  timeElement.innerHTML = "Tiempo :";
  timerOn = false;
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

function generateSequence(type) {
  sequence = [];
  const wordsArray = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "Ñ",
    "O",
    "P",
    "Q",
  ];

  if (type === "A") {
    for (let i = 0; i < gameConfig.numberOfMeteors; i++) {
      sequence.push(i + 1);
    }
  } else {
    for (let i = 0; i < gameConfig.numberOfMeteors; i++) {
      sequence.push(i + 1);
      sequence.push(wordsArray[i]);
    }
  }
}
