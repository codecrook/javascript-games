{
    class Ghost {
        constructor(className, startIndex, speed) {
            this.className = className;
            this.startIndex = startIndex;
            this.speed = speed;
            this.currentIndex = startIndex;
            this.isScared = false;
            this.timerId = NaN;
        }
    }
    const ghosts = [
        new Ghost('blinky', 348, 250),
        new Ghost('pinky', 376, 400),
        new Ghost('inky', 351, 300),
        new Ghost('clyde', 379, 500)
    ];
    const [width, grid, scoreDisplay, squares] = [
        28,
        document.querySelector('.grid'),
        document.querySelector('#score'),
        []
    ];
    let score = 0;

    //28 * 28 = 784
    // 0 - pac-dot
    // 1 - wall
    // 2 - ghost-lair
    // 3 - power-pellet
    // 4 - empty

    const layout = [
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
        1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1,
        1, 3, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 3, 1,
        1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1,
        1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1,
        1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1,
        1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 1, 1, 2, 2, 1, 1, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 2, 2, 2, 2, 2, 2, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1,
        4, 4, 4, 4, 4, 4, 0, 0, 0, 4, 1, 2, 2, 2, 2, 2, 2, 1, 4, 0, 0, 0, 4, 4, 4, 4, 4, 4,
        1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 2, 2, 2, 2, 2, 2, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1,
        1, 1, 1, 1, 1, 1, 0, 1, 1, 4, 1, 1, 1, 1, 1, 1, 1, 1, 4, 1, 1, 0, 1, 1, 1, 1, 1, 1,
        1, 0, 0, 0, 0, 0, 0, 0, 0, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1,
        1, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1,
        1, 3, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 3, 1,
        1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1,
        1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1,
        1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1,
        1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1,
        1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1,
        1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,
        1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
    ];

    const types = ['pac-dot', 'wall', 'ghost-lair', 'power-pellet', 'empty'];

    // function to create the game board
    function createBoard() {
        const fragment = document.createDocumentFragment();
        layout.forEach(blockCode => {
            // create a square
            const square = document.createElement('div');
            square.classList.add(types[blockCode]);

            // put square in fragment
            fragment.appendChild(square);

            // put square in squares array
            squares.push(square);
        });

        // put fragment in grid
        grid.appendChild(fragment);
    }

    createBoard();

    let pacmanCurrentIndex = 490;
    squares[pacmanCurrentIndex].className = 'pacman';

    function control(e) {
        squares[pacmanCurrentIndex].classList.remove('pacman');

        switch (e.key) {
            case 'ArrowUp':
                (
                    !squares[pacmanCurrentIndex - width].classList.contains('ghost-lair') &&
                    !squares[pacmanCurrentIndex - width].classList.contains('wall') &&
                    pacmanCurrentIndex - width >= 0
                ) && (pacmanCurrentIndex -= width);
                break;
            case 'ArrowDown':
                (
                    !squares[pacmanCurrentIndex + width].classList.contains('ghost-lair') &&
                    !squares[pacmanCurrentIndex + width].classList.contains('wall') &&
                    pacmanCurrentIndex + width < width * width
                ) && (pacmanCurrentIndex += width);
                break;
            case 'ArrowLeft':
                (
                    !squares[pacmanCurrentIndex - 1].classList.contains('ghost-lair') &&
                    !squares[pacmanCurrentIndex - 1].classList.contains('wall') &&
                    pacmanCurrentIndex % width !== 0
                ) && (pacmanCurrentIndex -= 1);

                (pacmanCurrentIndex === 364) && (pacmanCurrentIndex = 391);
                break;
            case 'ArrowRight':
                (
                    !squares[pacmanCurrentIndex + 1].classList.contains('ghost-lair') &&
                    !squares[pacmanCurrentIndex + 1].classList.contains('wall') &&
                    pacmanCurrentIndex % width < width - 1
                ) && (pacmanCurrentIndex += 1);

                (pacmanCurrentIndex === 391) && (pacmanCurrentIndex = 364);
                break;
        }

        pacDotEaten();
        powerPelletEaten();
        squares[pacmanCurrentIndex].classList.add('pacman');
    }

    function pacDotEaten() {
        if (squares[pacmanCurrentIndex].classList.contains('pac-dot')) {
            squares[pacmanCurrentIndex].classList.remove('pac-dot');
            ++score;
            scoreDisplay.innerHTML = score;
        }
    }

    function powerPelletEaten() {
        //if square pacman is in contains a power pellet
        if (squares[pacmanCurrentIndex].classList.contains('power-pellet')) {
            //remove power-pellet class from that place
            squares[pacmanCurrentIndex].classList.remove('power-pellet');
            //add a score of 10
            score += 10;
            //display the score
            scoreDisplay.innerHTML = score;
            //change each of the four ghosts to isScared
            ghosts.forEach(ghost => ghost.isScared = true);
            //use setTimeout to unscare ghosts after 10 seconds     
            setTimeout(unScareGhosts, 10000);
        }
    }

    function unScareGhosts() {
        ghosts.forEach(ghost => ghost.isScared = false);
    }

    function moveGhost(ghost) {
        const directions = [-1, +1, -width, +width];
        let direction = directions[Math.floor(Math.random() * directions.length)];

        ghost.timerId = setInterval(function () {
            //if the next square does NOT contain a wall and a ghost
            if (
                !squares[ghost.currentIndex + direction].classList.contains('wall') &&
                !squares[ghost.currentIndex + direction].classList.contains('ghost')
            ) {
                //remove any ghost
                squares[ghost.currentIndex].classList.remove(ghost.className, 'ghost', 'scared-ghost');
                //add direction to current Index
                ghost.currentIndex += direction;
                //add ghost class
                squares[ghost.currentIndex].classList.add(ghost.className, 'ghost');
            } else {
                direction = directions[Math.floor(Math.random() * directions.length)];
            }

            //if the ghost is currently scared
            if (ghost.isScared) {
                squares[ghost.currentIndex].classList.add('scared-ghost')
            }
        }, ghost.speed)
    }

    ghosts.forEach(ghost => squares[ghost.currentIndex].classList.add(ghost.className, 'ghost'));
    ghosts.forEach(ghost => moveGhost(ghost));
    document.addEventListener('keyup', control);
}