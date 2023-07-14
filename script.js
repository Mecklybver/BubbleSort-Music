const n = 50;
const array = [];
const container = document.querySelector(".container");
playAgain = true;

initiate();

function initiate(){
    
    for (let i = 0; i < n; i++) {
    array[i] = Math.random();
  }
  showBars();
    
}

let audioCtx = null;

function playNote(freq) {
  if (audioCtx === null) {
    audioCtx = new AudioContext();
  }
  const dur = 0.02;
  const osc = audioCtx.createOscillator();
  osc.frequency.value = freq;
  const node = audioCtx.createGain();
  node.gain.value = 0.1;
  node.gain.linearRampToValueAtTime(0, audioCtx.currentTime + dur);
  osc.connect(node);
  node.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + dur);
}

function init() {
    if(playAgain){
  for (let i = 0; i < n; i++) {
    array[i] = Math.random();
  }
  showBars();}
}

function play() {
  if (playAgain) {
    playAgain = false;
    const copy = [...array];
    const moves = bubbleSorts(copy);
    animate(moves);
  }
}

function animate(moves) {
  if (moves.length == 0) {
    const bars = document.querySelectorAll(".bar");
    for (let i = bars.length - 1; i >= 0; i--) {
      const bar = bars[i];
      const previousBar = bars[i + 1];
      setTimeout(function () {
        bar.style.backgroundColor = "green";
        playNote(200 + array[i] * 500);
        if (previousBar) {
          previousBar.style.backgroundColor = "black";
          playNote(200 + array[i + 1] * 500);
          if (i == 0) {
            bars[0].style.backgroundColor = "black";
            playAgain = true;
          }
        }
      }, 100 * (bars.length - i));
    }
    return;
  }
  const move = moves.shift();
  const [i, j] = move.indices;
  if (move.type == "swap") {
    [array[i], array[j]] = [array[j], array[i]];
  }
  playNote(100 + array[j] * 700);
  playNote(100 + array[i] * 1700);
  showBars(move);
  setTimeout(function () {
    animate(moves);
  }, 10);
}

function bubbleSorts(array) {
  const moves = [];
  do {
    var swapped = false;
    for (let i = 1; i < array.length; i++) {
      moves.push({
        indices: [i - 1, i],
        type: "comparison",
      });
      if (array[i - 1] > array[i]) {
        swapped = true;
        moves.push({
          indices: [i - 1, i],
          type: "swap",
        });
        [array[i - 1], array[i]] = [array[i], array[i - 1]];
      }
    }
    // for (let i = array.length -1; i > 0; i--) {
    //     moves.push({
    //       indices: [i - 1, i],
    //       type: "comparison",
    //     });
    //     if (array[i - 1] > array[i]) {
    //       swapped = true;
    //       moves.push({
    //         indices: [i - 1, i],
    //         type: "swap",
    //       });
    //       [array[i - 1], array[i]] = [array[i], array[i - 1]];
    //     }
    //   }
  } while (swapped);
  return moves;
}

function showBars(move) {
  container.innerHTML = "";
  for (let i = 0; i < array.length; i++) {
    const bar = document.createElement("div");
    bar.style.height = array[i] * 100 + "%";
    bar.classList.add("bar");
    if (move && move.indices.includes(i)) {
      bar.style.backgroundColor = move.type == "swap" ? "red" : "blue";
    }
    container.appendChild(bar);
  }
}
