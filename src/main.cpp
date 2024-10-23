#include <cstddef>
#include <cstdint>
#include <cstdio>
#include <cstdlib>

class GameOfLife {
public:
#ifdef __EMSCRIPTEN__
  // Constructor for WebAssembly with memory buffer passed from JS
  GameOfLife(size_t bufferOffset, size_t width, size_t height)
      : _width(width), _height(height), _generation(0) {
    printf(
        "Creating a game of life instance with a world of size: (%zu, %zu)\n",
        width, height);

    // Convert buffer offset into a pointer for memory manipulation
    _buffer = reinterpret_cast<uint8_t *>(bufferOffset);

    // Initialize the buffer to zero to avoid random values in the cells
    for (size_t i = 0; i < _width * _height; ++i) {
      _buffer[i] = 0;
    }
  }
#else
  // Native constructor for non-WebAssembly environments
  GameOfLife(uint8_t *buffer, size_t width, size_t height)
      : _width(width), _height(height), _buffer(buffer), _generation(0) {
    // Initialize the buffer to zero
    for (size_t i = 0; i < _width * _height; ++i) {
      _buffer[i] = 0;
    }
  }
#endif

  void step() {
    uint8_t *new_grid = new uint8_t[_width * _height]();

    for (size_t y = 0; y < _height; ++y) {
      for (size_t x = 0; x < _width; ++x) {
        int aliveNeighbors = countAliveNeighbors(x, y);
        size_t index = y * _width + x;
        if (_buffer[index] && (aliveNeighbors < 2 || aliveNeighbors > 3)) {
          new_grid[index] = 0;
        } else if (!_buffer[index] && aliveNeighbors == 3) {
          new_grid[index] = 1;
        } else {
          new_grid[index] = _buffer[index];
        }
      }
    }

    for (size_t i = 0; i < _width * _height; ++i) {
      _buffer[i] = new_grid[i];
    }

    _generation++;

    delete[] new_grid;
  }

  void clear() {
    for (size_t i = 0; i < _width * _height; ++i) {
      _buffer[i] = 0;
    }
    _generation = 0;
  }

  void toggleCell(size_t x, size_t y) {
    _buffer[y * _width + x] = !_buffer[y * _width + x];
  }

  uint8_t getCell(size_t x, size_t y) const { return _buffer[y * _width + x]; }

  size_t getGeneration() const { return _generation; }

  void render() const {
    printf("Generation: %zu\n", _generation);
    printf("+");
    for (size_t i = 0; i < _width; i++) {
      printf("-");
    }
    printf("+\n");

    for (size_t y = 0; y < _height; ++y) {
      printf("|");
      for (size_t x = 0; x < _width; ++x) {
        size_t index = y * _width + x;
        printf("%c", _buffer[index] ? '*' : ' ');
      }
      printf("|\n");
    }

    printf("+");
    for (size_t i = 0; i < _width; i++) {
      printf("-");
    }
    printf("+\n");
  }

private:
  uint8_t *_buffer;
  size_t _width;
  size_t _height;
  size_t _generation;

  int countAliveNeighbors(int x, int y) {
    int count = 0;

    for (int dy = -1; dy <= 1; ++dy) {
      for (int dx = -1; dx <= 1; ++dx) {
        if (dx == 0 && dy == 0)
          continue;

        size_t nx = (x + dx + _width) % _width;
        size_t ny = (y + dy + _height) % _height;

        if (_buffer[ny * _width + nx]) {
          count++;
        }
      }
    }

    return count;
  }
};

#ifndef __EMSCRIPTEN__
#include <thread>

int main(int argc, char *argv[]) {
  uint8_t *buffer = new uint8_t[20 * 20]();

  GameOfLife game(buffer, 20, 20);

  for (size_t i = 0; i < 30; ++i) {
    size_t randX = rand() % 20;
    size_t randY = rand() % 20;

    game.toggleCell(randX, randY);
  }

  while (game.getGeneration() < 50) {
    game.render();
    game.step();

    if (game.getGeneration() % 2 == 0) {
      size_t randX = rand() % 20;
      size_t randY = rand() % 20;

      game.toggleCell(randX, randY);
    }

    std::this_thread::sleep_for(std::chrono::milliseconds(100));
    system("clear"); // Clear the screen (not ideal but works for demo)
  }

  delete[] buffer;
  return 0;
}

#else

#include <emscripten/bind.h>

// Binding the GameOfLife class for WebAssembly
EMSCRIPTEN_BINDINGS(game_of_life) {
  emscripten::class_<GameOfLife>("GameOfLife")
      .constructor<size_t, size_t, size_t>() // Pass bufferOffset, width, height
      .function("getCell", &GameOfLife::getCell)
      .function("getGeneration", &GameOfLife::getGeneration)
      .function("toggleCell", &GameOfLife::toggleCell)
      .function("step", &GameOfLife::step)
      .function("clear", &GameOfLife::clear);
}

#endif
