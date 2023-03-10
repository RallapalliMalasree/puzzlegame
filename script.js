class Game {
    constructor(state) {
        console.log("state", state)
        this.state = state;
        this.tickId = null;
        this.tick = this.tick.bind(this);
        this.draw();
        this.handleClickBox = this.manageClickBox.bind(this);
    }

    static ready() {
        return new Game(State.ready());
    }

    tick() {
        this.setState({ time: this.state.time + 1 });
    }

    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.draw();
    }

    manageClickBox(box) {
        return function () {
            const nextdoorBoxes = box.getNextdoorBoxes();
            const blankBox = nextdoorBoxes.find(
                nextdoorBox => this.state.grid[nextdoorBox.y][nextdoorBox.x] === 0
            );
            if (blankBox) {
                const newGrid = [...this.state.grid];
                swapBoxes(newGrid, box, blankBox);
                if (isSolved(newGrid)) {
                    clearInterval(this.tickId);
                    this.setState({
                        status: "won",
                        grid: newGrid,
                        move: this.state.move + 1
                    });
                } else {
                    this.setState({
                        grid: newGrid,
                        move: this.state.move + 1
                    });
                }
            }
        }.bind(this);
    }

    setSampleGrid() {
        const newGrid = [...this.state.grid];
        newGrid[0][0] = 1
        newGrid[0][1] = 2
        newGrid[0][2] = 3
        newGrid[0][3] = 4
        newGrid[1][0] = 5
        newGrid[1][1] = 6
        newGrid[1][2] = 7
        newGrid[1][3] = 8
        newGrid[2][0] = 9
        newGrid[2][1] = 10
        newGrid[2][2] = 11
        newGrid[2][3] = 12
        newGrid[3][0] = 13
        newGrid[3][1] = 14
        newGrid[3][2] = 0
        newGrid[3][3] = 15
        this.setState({status: "playing", grid: newGrid, move: 0});
        this.draw();
  }

  winAlert() {
    setTimeout(() => {
        alert("CONGRATULATIONS!\n" +
            "you've done it\n" +
            "\n" +
            `Total moves: ${this.state.move}\n` +
            `Total time: ${this.state.time}\n`);
    }, 10);
  }

    draw() {
        const { grid, move, time, status } = this.state;

        const newGrid = document.createElement("div");
        newGrid.className = "grid";
        for (let i = 0; i <= 3 ; i++) {
            for (let j = 0; j <= 3; j++) {
                const button = document.createElement("button");

                if (status === "playing") {
                    button.addEventListener("click", this.manageClickBox(new Box(j, i)));
                }

                button.textContent = grid[i][j] === 0 ? "" : grid[i][j].toString();
                newGrid.appendChild(button);
            }
        }
        document.querySelector(".grid").replaceWith(newGrid);

        const newButton = document.createElement("button");
        if (status === "ready") newButton.textContent = "Play";
        if (status === "playing") newButton.textContent = "Reset";
        if (status === "won") newButton.textContent = "Play";
        newButton.addEventListener("click", () => {
            clearInterval(this.tickId);
            
            this.tickId = setInterval(this.tick, 1000);
            this.setState(State.start());
        });
        document.querySelector(".footer button").replaceWith(newButton);

        document.getElementById("sample").addEventListener("click", () => {
            this.setSampleGrid();
        });

        //for move
        document.getElementById("move").textContent = `Move: ${move}`;

        // for time
        document.getElementById("time").textContent = `Time: ${time}`;

        // for message
        if (status === "won") {
            document.querySelector(".message").textContent = "You win!";
            this.winAlert();
        } else {
            document.querySelector(".message").textContent = "";
        }
    }
}

class State {
    constructor(grid, move, time, status) {
        this.grid = grid;
        this.time = time;
        this.move = move;
        this.status = status;
    }

    static ready() {
        return new State(
            [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]],
            0,
            0,
            "ready"
        );
    }

    static start() {
        console.log(new State(getRandomGrid(), 0, 0, "playing"))
        return new State(getRandomGrid(), 0, 0, "playing");
    }
}

class Box {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    getTopBox() {
        if (this.y === 0) return null;
        return new Box(this.x, this.y - 1);
    }

    getRightBox() {
        if (this.x === 3) return null;
        return new Box(this.x + 1, this.y);
    }

    getBottomBox() {
        if (this.y === 3) return null;
        return new Box(this.x, this.y + 1);
    }

    getLeftBox() {
        if (this.x === 0) return null;
        return new Box(this.x - 1, this.y);
    }

    getNextdoorBoxes() {
        return [
            this.getTopBox(),
            this.getRightBox(),
            this.getBottomBox(),
            this.getLeftBox()
        ].filter(box => box !== null);
    }

    getRandomNextdoorBox() {
        const nextdoorBoxes = this.getNextdoorBoxes();
        return nextdoorBoxes[Math.floor(Math.random() * nextdoorBoxes.length)];
    }
}

const isSolved = grid => {
    return ( 
        grid[0][0] === 1 &&
        grid[0][1] === 2 &&
        grid[0][2] === 3 &&
        grid[0][3] === 4 &&
        grid[1][0] === 5 &&
        grid[1][1] === 6 &&
        grid[1][2] === 7 &&
        grid[1][3] === 8 &&
        grid[2][0] === 9 &&
        grid[2][1] === 10 &&
        grid[2][2] === 11 &&
        grid[2][3] === 12 &&
        grid[3][0] === 13 &&
        grid[3][1] === 14 &&
        grid[3][2] === 15 &&
        grid[3][3] === 0
    );
};

const swapBoxes = (grid, box1, box2) => {
    const temp = grid[box1.y][box1.x];
    grid[box1.y][box1.x] = grid[box2.y][box2.x];
    grid[box2.y][box2.x] = temp;
};

const getRandomGrid = () => {
    let grid = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 0]];

    let blankBox = new Box(3, 3);
    for (let i = 0; i < 1000; i++) {
        const randomNextdoorBox = blankBox.getRandomNextdoorBox();
        swapBoxes(grid, blankBox, randomNextdoorBox);
        blankBox = randomNextdoorBox;
    }

    if (isSolved(grid)) return getRandomGrid();
    return grid;
};

const GAME = Game.ready();
