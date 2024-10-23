COMPILER=g++
OPTIONS=-g -std=c++17 -pedantic -Wall
COMPILE=$(COMPILER) $(OPTIONS)
MKDIR_P=mkdir -p
OUT_DIR=out
EMCC=emcc

.PHONY: directories all clean wasm desktop

all: wasm desktop

directories: ${OUT_DIR}

wasm: directories
	$(EMCC) src/main.cpp -o $(OUT_DIR)/app.js -O3 -s WASM=1 -s MODULARIZE=1 -s 'EXPORT_NAME="createModule"' --bind

desktop: directories
	$(COMPILE) src/main.cpp -o $(OUT_DIR)/app

run: desktop
	$(OUT_DIR)/app

clean:
	rm -rf ${OUT_DIR}/*
