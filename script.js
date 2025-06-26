window.onload = function() {
  // Set up canvas
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  const width = 500;
  const height = 500;
  const gridSize = 10;
  const cellSize = width / gridSize;

  // Load deity images
  const deityImages = {
    "pomba gira": "assets/pombagira.PNG",
    "erzuli freda": "assets/erzulifreda.PNG",
    "erzuli dantor": "assets/erzulidanto.PNG",
    "oshun": "assets/oshun.PNG",
    "kyra": "assets/kyra.JPG"
  };

  // Load cowry shell image
  const cowryShellImg = new Image();
  cowryShellImg.src = "assets/pngegg.png";

  // Accepted deities list
  const acceptedDeities = Object.keys(deityImages);

  // Game state variables
  let chosenDeity = null;
  let questionAsked = false;
  let positions = [];

  // Show initial greeting message
  function greeting() {
    alert("click OK to view the pantheon!");
  }

  // Draws a 10x10 grid on the canvas
  function drawGrid() {
    ctx.strokeStyle = "black";
    for (let x = 0; x <= width; x += cellSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }
    for (let y = 0; y <= height; y += cellSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  }

  // Generates 16 unique random positions on the grid
  function generateRandomPositions() {
    const pos = new Set();
    while (pos.size < 16) {
      const x = Math.floor(Math.random() * gridSize);
      const y = Math.floor(Math.random() * gridSize);
      pos.add(`${x},${y}`);
    }
    return Array.from(pos).map(p => p.split(',').map(Number));
  }

  // Draws cowry shells at specified grid positions
  function drawShells(positions) {
    for (let [x, y] of positions) {
      ctx.drawImage(cowryShellImg, x * cellSize + 2, y * cellSize + 2, cellSize - 5, cellSize - 5);
    }
  }

  function drawPantheon(callback) {
    const deities = Object.keys(deityImages);
    const images = [];
    let loaded = 0;

    deities.forEach((deity, i) => {
      const img = new Image();
      img.src = deityImages[deity];

      img.onload = () => {
        images[i] = img;
        loaded++;

        if (loaded === deities.length) {
          // Calculate total width of all images
          const totalWidth = images.length * 100;

          // calculate starting position to centre the image
          const startX = (width - totalWidth) / 2;

          // draw each image
          images.forEach((img, j) => {
            const x = startX + j * 100;
            const y = height / 2 - 50;
            ctx.drawImage(img, x, y, 100, 100);
          });

          if (callback) callback();
        }
      };
    });
  }  

  // Main game interaction
  canvas.addEventListener("click", () => {
    if (!questionAsked) {
      greeting();
      ctx.clearRect(0, 0, width, height);

      // Step 1: Draw pantheon
      drawPantheon(() => {
        // Step 2: Wait a moment so images appear BEFORE blocking with prompt
        setTimeout(() => {
          let response = prompt("which deity would you like to convene with through divination?");
          if (!response) return;
          chosenDeity = response.toLowerCase();

          if (!acceptedDeities.includes(chosenDeity)) {
            alert("invalid choice. try again.");
            return;
          }

          alert("click OK to divine.");
          ctx.clearRect(0, 0, width, height);
          drawGrid();
          positions = generateRandomPositions();
          drawShells(positions);

          // Step 3: Wait a moment so the divination grid & shells appear BEFORE next prompt
          setTimeout(() => {
            const offerings = {
              "pomba gira": ["red candle","red candles", "roses", "perfume", "cosmetics", "champagne", "alcohol", "tobacco products"],
              "erzuli freda": ["fine items", "makeup", "perfume", "sweets", "fans", "mirrors", "champagne"],
              "erzuli dantor": ["hot fruit", "hot fruits", "pineapple", "orange", "mangoe", "pineapples", "oranges", "magoes", "fried pork", "red wine", "reve d'or perfume", "chodye twya pye"],
              "oshun": ["honey", "pumpkin", "peacock", "vulture", "sunflower"],
              "kyra": ["fresh fruit", "flowers", "good luck charms", "perfume", "champagne"]
            };

            let offerResponse = prompt(`congratulations! ${chosenDeity} would like to speak with you. what will you offer them?`);
            if (!offerResponse) return;
            const offering = offerResponse.toLowerCase();

            if (offerings[chosenDeity].includes(offering)) {
              alert(`congratulations! ${chosenDeity} accepted your offering. game complete.`);
            } else {
              alert(`hmm... ${chosenDeity} is not pleased with that offering. try again next time.`);
            }

            questionAsked = true;
          }, 100); // <-- wait before offering prompt
        }, 100); // <-- wait before deity prompt
      });
    }
  });
};
