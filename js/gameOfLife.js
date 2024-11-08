async function loadPatterns() {
    const response = await fetch("patterns.json");
    const data = await response.json();
    return data.patterns;
}

createModule().then(async (Module) => {
    const WIDTH = 50;
    const HEIGHT = 50;
    let CELL_SIZE = 10;
    const totalMemoryRequired = WIDTH * HEIGHT * CELL_SIZE;
    const pageSize = 64 * 1024;
    const pagesRequired = Math.ceil(totalMemoryRequired / pageSize);

    const memory = new WebAssembly.Memory({
        initial: pagesRequired,
        shared: true,
        maximum: pagesRequired + 5,
    });

    const memoryView = new Uint8Array(memory.buffer);
    const game = new Module.GameOfLife(memoryView.byteOffset, WIDTH, HEIGHT);

    const canvas = document.getElementById("world");
    canvas.width = WIDTH * CELL_SIZE;
    canvas.height = HEIGHT * CELL_SIZE;
    const ctx = canvas.getContext("2d");

    const playBtn = document.getElementById("play-btn");
    const stepBtn = document.getElementById("step-btn");
    const clearBtn = document.getElementById("clear-btn");
    const generationLabel = document.getElementById("generation-label");
    const patternLibraryContainer = document.getElementById(
        "pattern-library--patterns",
    );
    const searchInput = document.getElementById("pattern-search");
    const themeToggleBtn = document.getElementById("theme-toggle");
    const fpsSlider = document.getElementById("fps-slider");
    const fpsValueLabel = document.getElementById("fps-value");

    let patterns = await loadPatterns();
    let selectedPattern = null;
    let isPreviewing = false;
    let previewPosition = { x: 0, y: 0 };

    let fps = parseInt(fpsSlider.value, 10);
    let fpsIntervalMs = 1000 / fps;
    let lastRenderTime = Number.MIN_VALUE;
    let isPlaying = true;
    let isDarkMode = localStorage.getItem("theme") === "dark" ?? false;

    if (isDarkMode) {
        document.body.classList.add("dark-mode");
        themeToggleBtn.innerText = "Switch to Light Mode";
    }

    playBtn.innerText = isPlaying ? "Pause" : "Play";

    playBtn.addEventListener("click", () => {
        isPlaying ? pause() : play();
    });

    clearBtn.addEventListener("click", () => {
        game.clear();
    });

    stepBtn.addEventListener("click", () => {
        pause();
        step();
        draw();
    });

    fpsSlider.addEventListener("input", () => {
        fps = parseInt(fpsSlider.value, 10);
        fpsIntervalMs = 1000 / fps;
        fpsValueLabel.textContent = fps;
    });

    themeToggleBtn.addEventListener("click", () => {
        isDarkMode = !isDarkMode;
        localStorage.setItem("theme", isDarkMode ? "dark" : "light");
        document.body.classList.toggle("dark-mode");
        themeToggleBtn.innerText = isDarkMode
            ? "Switch to Light Mode"
            : "Switch to Dark Mode";
        draw();
    });

    searchInput.addEventListener("input", (event) => {
        const searchQuery = event.target.value.toLowerCase();
        updatePatternLibrary(searchQuery);
    });

    canvas.addEventListener("mousemove", (event) => {
        if (selectedPattern && isPreviewing) {
            const { offsetX: x, offsetY: y } = event;
            const gridX = Math.floor(x / CELL_SIZE);
            const gridY = Math.floor(y / CELL_SIZE);

            previewPosition = { x: gridX, y: gridY };
            draw();
            drawPreview();
        }
    });

    canvas.addEventListener("click", (event) => {
        if (selectedPattern && isPreviewing) {
            const { offsetX: x, offsetY: y } = event;
            const gridX = Math.floor(x / CELL_SIZE);
            const gridY = Math.floor(y / CELL_SIZE);

            selectedPattern.forEach((row, dy) => {
                row.forEach((cell, dx) => {
                    if (cell === 1) {
                        game.toggleCell(gridX + dx, gridY + dy);
                    }
                });
            });

            draw();
        }
    });

    function draw() {
        for (let y = 0; y < HEIGHT; ++y) {
            for (let x = 0; x < WIDTH; ++x) {
                const cell = game.getCell(x, y);
                ctx.fillStyle =
                    cell === 0
                        ? isDarkMode
                            ? "black"
                            : "white"
                        : isDarkMode
                            ? "white"
                            : "black";
                ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            }
        }
    }

    function drawPreview() {
        if (selectedPattern && isPreviewing) {
            const { x, y } = previewPosition;
            drawPattern(
                ctx,
                selectedPattern,
                x,
                y,
                CELL_SIZE,
                isDarkMode ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)",
            );
        }
    }

    function step() {
        game.step();
        if (generationLabel !== null) {
            generationLabel.innerText = `Generation: ${game.getGeneration()}`;
        }
    }

    function play() {
        isPlaying = true;
        playBtn.innerText = "Pause";
    }

    function pause() {
        isPlaying = false;
        playBtn.innerText = "Play";
    }

    function drawPattern(
        ctx,
        pattern,
        startX,
        startY,
        cellSize,
        color = "rgba(0, 0, 0, 0.5)",
        isPreview = false,
    ) {
        const patternWidth = pattern[0].length;
        const patternHeight = pattern.length;

        let scaleFactor = cellSize;
        if (isPreview) {
            // Scale for pattern preview on the small canvas (100x100)
            scaleFactor = Math.min(100 / patternWidth, 100 / patternHeight);
        }

        const offsetX = isPreview ? (100 - scaleFactor * patternWidth) / 2 : 0;
        const offsetY = isPreview ? (100 - scaleFactor * patternHeight) / 2 : 0;

        ctx.fillStyle = color;
        pattern.forEach((row, y) => {
            row.forEach((cell, x) => {
                if (cell === 1) {
                    ctx.fillRect(
                        (startX + x) * scaleFactor + offsetX,
                        (startY + y) * scaleFactor + offsetY,
                        scaleFactor,
                        scaleFactor,
                    );
                }
            });
        });
    }

    function updatePatternLibrary(searchQuery = "") {
        patternLibraryContainer.innerHTML = "";
        Object.keys(patterns).forEach((patternName) => {
            if (patternName.toLowerCase().includes(searchQuery)) {
                const patternElement = document.createElement("div");
                patternElement.className = "pattern-library--pattern";
                patternElement.innerHTML = `<p>Name: <span>${patternName}</span></p><canvas id="pattern-library--pattern-${patternName.toLowerCase()}" width="100" height="100"></canvas>`;
                patternLibraryContainer.appendChild(patternElement);

                const patternCanvas = patternElement.querySelector("canvas");
                const patternCtx = patternCanvas.getContext("2d");

                const patternData = patterns[patternName];
                drawPattern(
                    patternCtx,
                    patternData,
                    0,
                    0,
                    10,
                    isDarkMode ? "white" : "black",
                    true,
                );

                patternElement.addEventListener("click", () => {
                    selectedPattern = patternData;
                    isPreviewing = true;
                });
            }
        });
    }

    updatePatternLibrary();

    function gameLoop(timestamp) {
        const deltaTime = timestamp - lastRenderTime;

        if (deltaTime > fpsIntervalMs && isPlaying) {
            step();
            lastRenderTime = timestamp;
        }
        draw();
        drawPreview();

        requestAnimationFrame(gameLoop);
    }

    gameLoop();

    function resizeCanvas() {
        const canvasContainerWidth =
            document.querySelector(".container").clientWidth;
        const maxCanvasWidth = Math.min(canvasContainerWidth - 40, 600); // Limit to 600px or available width
        const scaleFactor = maxCanvasWidth / (WIDTH * CELL_SIZE);

        canvas.width = WIDTH * CELL_SIZE * scaleFactor;
        canvas.height = HEIGHT * CELL_SIZE * scaleFactor;

        CELL_SIZE *= scaleFactor;

        draw();
        drawPreview();
    }

    window.addEventListener("resize", resizeCanvas);

    resizeCanvas();
});
