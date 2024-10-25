# 🌐 Conway's Game of Life in WebAssembly

# 🚀 Available here: https://wasm-of-life.fly.dev/

https://github.com/user-attachments/assets/ab4440f1-f159-432c-9b3d-b60e9a2f266a


Welcome to my WebAssembly-powered implementation of Conway's Game of Life! This project is all about learning, experimenting, and having fun with WebAssembly and JavaScript. 🛠️

## 🎮 What is the Game of Life?

Conway's Game of Life is a **cellular automaton** created by mathematician John Conway. It's a zero-player game where you set an initial configuration of cells, and they evolve based on simple rules:

1. A live cell with fewer than 2 or more than 3 live neighbors dies (underpopulation/overpopulation).
2. A live cell with 2 or 3 live neighbors continues to live.
3. A dead cell with exactly 3 live neighbors becomes alive (reproduction).

The result is a fascinating, often unpredictable evolution of patterns! Check out the [Wikipedia page](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life) for more.

## 🌟 Features

- **WebAssembly-Powered**: The core game logic is implemented in C++ and compiled to WebAssembly for fast performance.
- **Responsive UI**: The game adapts to different screen sizes, from desktops to mobile devices.
- **Dark/Light Mode**: Easily switch between themes for a comfortable viewing experience.
- **Pattern Library**: A collection of classic patterns like the **Glider**, **Gosper Glider Gun**, and many more.
- **FPS Control**: Adjust the game speed using a simple slider to see patterns unfold in slow-motion or lightning speed.
- **Interactive**: Click to toggle cells, hover to preview patterns, and drop them with a click.

## 🖥️ How It Works

### The Tech Stack

- **WebAssembly (Wasm)**: The game engine is written in C++ and compiled to Wasm, allowing for efficient calculations directly in the browser.
- **JavaScript**: Used to handle the user interface, pattern selection, and interactive elements.
- **HTML/CSS**: Provides a clean, responsive UI with dark and light mode support.

### Setup and Build

If you want to explore or tweak the project, here's a quick setup guide:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/adia-dev/wasm-of-life.git
   cd wasm-of-life
   ```

2. **Build the Project** (requires `emcc` for WebAssembly):
   ```bash
   make
   ```

3. **Run Locally**: Open the `index.html` file in your browser or use a local server like:
   ```bash
   python -m http.server
   ```

### 📁 Project Structure

- **`index.html`**: The main HTML file with the canvas and UI elements.
- **`css/style.css`**: Contains styles for both light and dark modes, as well as responsive adjustments.
- **`js/gameOfLife.js`**: Handles the JavaScript logic, including interaction and UI.
- **`patterns.json`**: Contains a library of patterns like the Glider, Lightweight Spaceship, and various guns.
- **`src/main.cpp`**: The C++ source for the Game of Life logic, compiled to WebAssembly, execute `make` after modifying it.
- **`out/app.js`**: Compiled JavaScript + WebAssembly output.

## 🎨 Some Patterns to Try

### Classic Patterns
- **Glider**: A small pattern that travels diagonally across the grid.
- **Blinker**: A simple oscillator that flips between horizontal and vertical.
- **Toad**: Another oscillator that shifts back and forth.
- **Block**: A stable pattern that never changes.

### Guns
- **Gosper Glider Gun**: Shoots a continuous stream of gliders across the grid. [More info](https://www.conwaylife.com/wiki/Gosper_glider_gun).
- **Simkin Glider Gun**: A compact, elegant gun that creates gliders with a smaller setup.
- **Canada Goose Gun**: A more complex structure with a unique shape.

## 📚 Learning WebAssembly

This project started as a way to dive into WebAssembly and learn how to leverage the performance of C++ in a web environment. If you're interested in learning more about WebAssembly, check out:

- [MDN WebAssembly Documentation](https://developer.mozilla.org/en-US/docs/WebAssembly)
- [WebAssembly GitHub Repository](https://github.com/WebAssembly)

## 🚀 What's Next?

- [ ] Adding more complex patterns (suggestions are welcome!).
- [ ] Implementing zoom/pan functionality.
- [ ] Exploring multiplayer interactions via WebSockets.
- [ ] Integrating save/load functionality for custom patterns.
