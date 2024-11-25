import debounce from "lodash/debounce";

let TILESIZE = 10;
let STRENGTH = 0.1;
let COLOR = "#1ab6e6";

let lastHoveredEl = null;
let elementsCoord = [];
let elMain = null;
let elGrid = null;

const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

const hoverEl = (el) => {
  if(el===lastHoveredEl) {
    return;
  }
  lastHoveredEl = el;
  const touchedCount = parseInt(el.getAttribute("data-touchedCount")) + 1;
  el.setAttribute("data-touchedCount", touchedCount);
  const {r,g,b} = hexToRgb(COLOR);
  el.style.background = `rgb(${r},${g},${b},${touchedCount*STRENGTH})`;
}

const buildGrid = () => {
  const nbTilesX = Math.floor(elMain.clientWidth/TILESIZE);
  const nbTilesY = Math.floor(elMain.clientHeight/TILESIZE);
  const nbTilesTotal = nbTilesX * nbTilesY;


  elGrid = document.querySelector(".grid");
  elGrid.style.width = `${nbTilesX*TILESIZE}px`;

  for (let i= 0; i<nbTilesTotal; i++) {
    const elDiv = document.createElement("div");
    elDiv.style.width = `${TILESIZE}px`;
    elDiv.style.height = `${TILESIZE}px`;
    elGrid.appendChild(elDiv);
  }

  const elements = elGrid.querySelectorAll('.grid div');
  elementsCoord = [];
  elements.forEach(element => {
    element.setAttribute("data-touchedCount", 0);
    elementsCoord.push({x: element.getBoundingClientRect().x, y: element.getBoundingClientRect().y, el: element})
  });

  // Add mouseover event listener
  elGrid.addEventListener("mouseover", onMouseOver);

  // Add touchstart event listener
  elGrid.addEventListener("touchmove", onTouchMove)
}

const updateGrid = () => {
  elementsCoord.lemgth = [];
  elGrid.removeEventListener("mouseover", onMouseOver);
  elGrid.removeEventListener("touchmove", onTouchMove)
  elGrid.innerHTML = "";
  buildGrid();
}

const onMouseOver = event => {
  // event.preventDefault();
  // event.stopPropagation()
  hoverEl(event.target);
};
const onTouchMove = (event) => {
  event.preventDefault();
  event.stopPropagation()
  const touchedCoord = {
    x: parseInt(event.touches[0].pageX),
    y: parseInt(event.touches[0].pageY)
  };
  const elTouched = elementsCoord.find((coord, index) => {
    const axisXLength = coord.x + TILESIZE;
    const axisYLength = coord.y + TILESIZE;
    return touchedCoord.x > coord.x &&
      touchedCoord.x <= axisXLength &&
      touchedCoord.y > coord.y &&
      touchedCoord.y <= axisYLength;
  });
  if(elTouched) {
    hoverEl(elTouched.el);
  }
};

const initConfig = () => {

  // TILESIZE CHOICE
  const elTilesize = document.querySelector("#tilesize");
  const outputTilesize = document.querySelector(".tilesize-output");
  elTilesize.value = TILESIZE;
  outputTilesize.textContent = `${TILESIZE}`;
  elTilesize.addEventListener("input", debounce(() => {
    TILESIZE = parseInt(elTilesize.value);
    outputTilesize.textContent = `${TILESIZE}`;
    updateGrid();
  }, 200));

  // STRENGTH OPACITY INIT
  const elStrength = document.querySelector("#strength");
  const outputStrength = document.querySelector(".strength-output");
  elStrength.value = STRENGTH;
  outputStrength.textContent = `${STRENGTH*100}%`;
  elStrength.addEventListener("input", () => {
    outputStrength.textContent = `${elStrength.value*100}%`;
    STRENGTH = elStrength.value;
  });

  // COLOR
  const elColor = document.querySelector("#colors");
  elColor.value = COLOR;
  elColor.addEventListener("input", (event) => {
    COLOR = elColor.value;
  })

  // Refresh
  const elRefreshButton = document.querySelector("footer button");
  elRefreshButton.addEventListener("click", () => {
    updateGrid();
  });
}


(function app(){
  window.addEventListener('DOMContentLoaded', () => {
    console.info('Dom Loaded');
    elMain = document.querySelector("main");
    initConfig();
    buildGrid();
  });
}());
