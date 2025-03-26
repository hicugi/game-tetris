const BOARD_SIZE = [10, 24];
const SHAPE_SIZE = 32;
const SHAPE_LIST = [
	'shape-f', 'shape-f_2', 'shape-f_3', 'shape-f_4',
	'shape-leg', 'shape-leg_2', 'shape-leg_3', 'shape-leg_4',
	'shape-leg_r', 'shape-leg_r2', 'shape-leg_r3', 'shape-leg_r4',
	'shape-z', 'shape-z_2', 'shape-z_r', 'shape-z_r2',
	'shape-square',
	'shape-line', 'shape-line_2',
];

const SHAPE_INFO = {
	'shape-f': [3, 2, [[0, 1, 0], [1,1,1]]], 'shape-f_2': [2, 3, [[1,0],[1,1],[1,0]]], 'shape-f_3': [3, 2, [[1,1,1],[0,1,0]]], 'shape-f_4': [2, 3, [[0,1],[1,1],[0,1]]],
	'shape-leg': [3, 2, [[1,1,1],[1,0,0]]], 'shape-leg_2': [2, 3, [[1,1],[0,1],[0,1]]], 'shape-leg_3': [3, 2, [[0,0,1],[1,1,1]]], 'shape-leg_4': [2, 3, [[1,0],[1,0],[1,1]]],
	'shape-leg_r': [3, 2, [[1,0,0],[1,1,1]]], 'shape-leg_r2': [2, 3, [[1,1],[1,0],[1,0]]], 'shape-leg_r3': [3, 2, [[1,1,1],[0,0,1]]], 'shape-leg_r4': [2, 3, [[0,1],[0,1],[1,1]]],
	'shape-z': [3, 2, [[1,1,0],[0,1,1]]], 'shape-z_2': [2, 3, [[0,1],[1,1],[1,0]]], 'shape-z_r': [3, 2, [[0,1,1],[1,1,0]]], 'shape-z_r2': [2, 3, [[1,0],[1,1],[0,1]]],
	'shape-square': [2, 2, [[1,1],[1,1]]],
	'shape-line': [4, 1, [[1,1,1,1]]], 'shape-line_2': [1, 4, [[1],[1],[1],[1]]],
};

const DIRECTIONS = {
	ArrowLeft: 'L',
	ArrowRight: 'R',
	ArrowDown: 'D',

	h: 'L',
	l: 'R',
	j: 'D',
};

const board = Array.from({ length: BOARD_SIZE[1] }, () => new Array(BOARD_SIZE[0]).fill(0));

const elmContent = document.querySelector('#content');
let nextShapeIdx = null;

function clearBoard() {
	for (let r=0; r < board.length; r++) {
		for (let c=0; c < board[0].length; c++) {
			board[r][c] = 0;
		}
	}
}

function setNextShape() {
	const idx = Math.floor(Math.random() * SHAPE_LIST.length);
	nextShapeIdx = idx;

	const elm = document.querySelector('#nextShape');

	for (const name of SHAPE_LIST) {
		elm.classList.remove(name);
	}

	elm.classList.add(SHAPE_LIST[idx]);
}

setNextShape();

function elmMoveShape(elm, t, l) {
	const { w, h } = elm.shapeData;

	const y = (t * SHAPE_SIZE).toFixed(4);
	const x = (l * SHAPE_SIZE).toFixed(4);

	elm.style.transform = `translate(${x}px, ${y}px)`;

	Object.assign(elm.shapeData, { t, l });
}
function createShape() {
	const elm = document.createElement('div');

	const name = SHAPE_LIST[nextShapeIdx];
	elm.className = `shape ${name}`;

	setNextShape();

	const [w, h, dots] = SHAPE_INFO[name];

	const randomShift = Math.round(w & 1 && Math.random() * 1);
	const l = BOARD_SIZE[0] / 2 - Math.floor(w / 2) - randomShift;
	const t = 1 - h;

	elm.shapeData = {
		name,
		w, h,
		t, l,
		dots,
	};

	elmMoveShape(elm, t, l);

	elmContent.appendChild(elm);
	return elm;
}

function validatePosition(elm, y, x) {
	const { w, h, dots } = elm.shapeData;

	if (h + y > BOARD_SIZE[1]) return false;
	if (x < 0 || w + x > BOARD_SIZE[0]) return false;

	for (let i=0; i < h; i++) {
		for (let j=0; j < w; j++) {
			if (dots[i][j] === 0) continue;
			if (y + i < 0) continue;

			if (board[y + i] === undefined || board[y + i][x + j] === 1) {
				return false;
			}
		}
	}

	return true;
}

let currentShape = createShape();
let action = null;
let prevLine = BOARD_SIZE[1];

function actionHandler() {
	if (action === null) return;

	const elm = currentShape;
	const { t, l, w, h, dots } = elm.shapeData;

	if (action === 'L' && validatePosition(elm, t, l - 1)) {
		elmMoveShape(elm, t, l - 1);
		return;
	}

	if (action === 'R' && validatePosition(elm, t, l + 1)) {
		elmMoveShape(elm, t, l + 1);
		return;
	}

	if (action === 'D' && validatePosition(elm, t + 1, l)) {
		elmMoveShape(elm, t + 1, l);
		return;
	}
}
function moveShape() {
	const elm = currentShape;
	const { name, l, t, w, h, dots } = elm.shapeData;

	if (validatePosition(elm, t + 1, l)) {
		elmMoveShape(elm, t + 1, l);
		return;
	}

	for (let i=0; i < h; i++) {
		for (let j=0; j < w; j++) {
			if (dots[i][j] === 0) continue;
			board[t + i][l + j] = 1;
		}
	}

	currentShape = createShape();
}

let downInterval, actionInterval;
function startEngine() {
	clearInterval(downInterval);

	downInterval = setInterval(() => {
		moveShape();
	}, 300);
	downInterval = setInterval(() => {
		actionHandler();
	}, 70);


	setTimeout(() => clearInterval(engineInterval), 50000);
}

function startGame() {
	clearBoard();
	startEngine();
}

document.addEventListener('keydown', (e) => {
	const direction = DIRECTIONS[e.key];

	if (direction === undefined) return;

	action = direction;
});
document.addEventListener('keyup', (e) => {
	action = null;
});

startGame();

