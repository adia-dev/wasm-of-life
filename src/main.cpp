#include <vector>

class GameOfLife {
public:
  int width, height;
  std::vector<std::vector<bool>> grid;

  GameOfLife(int w, int h)
      : width(w), height(h), grid(h, std::vector<bool>(w)) {}

  void step() {
    std::vector<std::vector<bool>> new_grid = grid;

    for (size_t y = 0; y < height; ++y) {
      for (size_t x = 0; x < width; ++x) {
        int alive_neighbors = count_alive_neighbors(x, y);
        if (grid[y][x] && (alive_neighbors < 2 || alive_neighbors > 3)) {
          new_grid[y][x] = false;
        } else if (!grid[y][x] && alive_neighbors == 3) {
          new_grid[y][x] = true;
        }
      }
    }

    grid = new_grid;
  }

  void toggle_cell(int x, int y) { grid[y][x] = !grid[y][x]; }

  bool get_cell(int x, int y) { return grid[y][x]; }

  const std::vector<std::vector<bool>> &get_grid() const { return grid; }

private:
  int count_alive_neighbors(int x, int y) {
    int count = 0;
    for (int dy = -1; dy <= 1; ++dy) {
      for (int dx = -1; dx <= 1; ++dx) {
        if (dx == 0 && dy == 0)
          continue;

        int nx = (x + dx + width) % width;
        int ny = (y + dy + height) % height;

        if (grid[ny][nx])
          count++;
      }
    }

    return count;
  }
};

#ifdef __EMSCRIPTEN__

#include <emscripten/bind.h>
using namespace emscripten;

EMSCRIPTEN_BINDINGS(game_of_life) {
  class_<GameOfLife>("GameOfLife")
      .constructor<int, int>()
      .function("step", &GameOfLife::step)
      .function("toggle_cell", &GameOfLife::toggle_cell)
      .function("get_cell", &GameOfLife::get_cell);
}

#endif
