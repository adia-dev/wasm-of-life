createModule().then((Module) => {
    var game = new Module.GameOfLife(40, 40);
    const canvas = document.getElementById("world");
    const ctx = canvas.getContext("2d");
    const CELL_SIZE = 10;
    const width = canvas.width / CELL_SIZE;
    const height = canvas.height / CELL_SIZE;

    let isPlaying = false;
    let lastUpdateTime = 0;
    const updateInterval = 50;

    const playPauseButton = document.getElementById("playPauseButton");
    const stepButton = document.getElementById("stepButton");

    canvas.addEventListener("click", (event) => {
        const { offsetX: x, offsetY: y } = event;
        const cellX = Math.floor(x / CELL_SIZE);
        const cellY = Math.floor(y / CELL_SIZE);

        game.toggle_cell(cellX, cellY);

        drawGrid();
    });

    function drawGrid() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const alive = game.get_cell(x, y);
                ctx.fillStyle = alive ? "#333" : "#f0f0f0";
                ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            }
        }
    }

    function step() {
        game.step();
        drawGrid();
    }

    function playPause() {
        isPlaying = !isPlaying;
        playPauseButton.innerText = isPlaying ? "Pause" : "Play";

        if (isPlaying) {
            requestAnimationFrame(runGame);
        }
    }

    function runGame(timestamp) {
        if (!isPlaying) return;
        if (timestamp - lastUpdateTime >= updateInterval) {
            step();
            lastUpdateTime = timestamp;
        }
        requestAnimationFrame(runGame);
    }

    playPauseButton.addEventListener("click", playPause);
    stepButton.addEventListener("click", step);

    drawGrid();
});
