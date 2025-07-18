const INTERVAL = 50;
const GAME_SPEED = 400;

const BOARD_SIZE = [10, 20];
const SHAPE_SIZE = 32;
const SHAPE_LIST = [
	'shape-f', 'shape-f_2', 'shape-f_3', 'shape-f_4',
	'shape-leg', 'shape-leg_2', 'shape-leg_3', 'shape-leg_4',
	'shape-legr', 'shape-legr_2', 'shape-legr_3', 'shape-legr_4',
	'shape-z', 'shape-z_2', 'shape-zr', 'shape-zr_2',
	'shape-square',
	'shape-line', 'shape-line_2',
];

const SHAPE_INFO = {
	'shape-f': [3, 2, [[0, 1, 0], [1,1,1]]], 'shape-f_2': [2, 3, [[1,0],[1,1],[1,0]]], 'shape-f_3': [3, 2, [[1,1,1],[0,1,0]]], 'shape-f_4': [2, 3, [[0,1],[1,1],[0,1]]],
	'shape-leg': [3, 2, [[1,1,1],[1,0,0]]], 'shape-leg_2': [2, 3, [[1,1],[0,1],[0,1]]], 'shape-leg_3': [3, 2, [[0,0,1],[1,1,1]]], 'shape-leg_4': [2, 3, [[1,0],[1,0],[1,1]]],
	'shape-legr': [3, 2, [[1,0,0],[1,1,1]]], 'shape-legr_2': [2, 3, [[1,1],[1,0],[1,0]]], 'shape-legr_3': [3, 2, [[1,1,1],[0,0,1]]], 'shape-legr_4': [2, 3, [[0,1],[0,1],[1,1]]],
	'shape-z': [3, 2, [[1,1,0],[0,1,1]]], 'shape-z_2': [2, 3, [[0,1],[1,1],[1,0]]], 'shape-zr': [3, 2, [[0,1,1],[1,1,0]]], 'shape-zr_2': [2, 3, [[1,0],[1,1],[0,1]]],
	'shape-square': [2, 2, [[1,1],[1,1]]],
	'shape-line': [4, 1, [[1,1,1,1]]], 'shape-line_2': [1, 4, [[1],[1],[1],[1]]],
};

const SHAPE_GROUP = {
	'shape-f': ['shape-f', 'shape-f_2', 'shape-f_3', 'shape-f_4'],
	'shape-leg': ['shape-leg', 'shape-leg_2', 'shape-leg_3', 'shape-leg_4'],
	'shape-legr': ['shape-legr', 'shape-legr_2', 'shape-legr_3', 'shape-legr_4'],
	'shape-z': ['shape-z', 'shape-z_2'],
	'shape-zr': ['shape-zr', 'shape-zr_2'],
	'shape-square': ['shape-square'],
	'shape-line': ['shape-line', 'shape-line_2'],
};

const DIRECTIONS = {
	ArrowLeft: 'L',
	ArrowRight: 'R',
	ArrowDown: 'D',
	ArrowUp: 'U',

	h: 'L',
	l: 'R',
	j: 'D',
	k: 'U',
};

const board = Array.from({ length: BOARD_SIZE[1] }, () => new Array(BOARD_SIZE[0]).fill(0));

const elmBoard = document.querySelector('#board');
let nextShapeIdx = null;

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

function updateStats(name) {
	const groupName = name.replace(/_\d$/, '');
	const elm = document.querySelector(`.stats [name='${groupName}']`);

	elm.innerText = Number(elm.innerText) + 1;
}

function rotateShape(elm) {
	let { l, t, name } = elm.shapeData;

	const variants = SHAPE_GROUP[name.replace(/_\d$/, '')];
	const idx = variants.indexOf(name);

	const nextName = variants[(idx + 1) % variants.length];
	const [w, h, dots] = SHAPE_INFO[nextName];

	if (validatePosition(dots, t, l)) {
		elm.classList.remove(name);
		elm.classList.add(nextName);

		elm.shapeData = {
			name: nextName,
			w, h,
			t, l,
			dots,
		};

		elmMoveShape(elm, t, l);
	}
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
	updateStats(name);

	elmBoard.appendChild(elm);
	return elm;
}

function validatePosition(dots, y, x) {
	const h = dots.length;
	const w = dots[0].length;

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

	if (action === 'L' && validatePosition(dots, t, l - 1)) {
		elmMoveShape(elm, t, l - 1);
		return;
	}

	if (action === 'R' && validatePosition(dots, t, l + 1)) {
		elmMoveShape(elm, t, l + 1);
		return;
	}

	if (action === 'D' && validatePosition(dots, t + 1, l)) {
		elmMoveShape(elm, t + 1, l);
		return;
	}

}
function actionRotate() {
	const elm = currentShape;
	const { t, l, w, h, dots } = elm.shapeData;

	rotateShape(elm);
}

const boardCtrl = {
	clear() {
		for (let r=0; r < board.length; r++) {
			for (let c=0; c < board[0].length; c++) {
				board[r][c] = 0;
			}
		}
	},

	init() {
		for (let i=0; i < board.length; i++) {
			const elm = document.createElement('DIV');
			elm.classList.add('board__item');
			elm.style.top = `${i * SHAPE_SIZE}px`;
			elmBoard.appendChild(elm);
		}
	},

	drawLastShape() {
		const size = SHAPE_SIZE;
		const elms = [...elmBoard.querySelectorAll('.board__item')];

		for (let r=0; r < board.length; r++) {
			const elm = elms[r];

			const value = board[r].map((v,i) => (v === 1 ? '#000' : 'transparent') + ` ${i * size}px ${(i+1) * size}px`).join(', ');
			elm.style.background = `linear-gradient(to right, ${value})`;
		}
	},

	update() {
		const { name, l, t, w, h, dots } = currentShape.shapeData;

		for (let i=0; i < h; i++) {
			for (let j=0; j < w; j++) {
				if (dots[i][j] === 0) continue;
				board[t + i][l + j] = 1;
			}
		}
	},

	clearRow() {
		const { l, t, w, h } = currentShape.shapeData;

		const rows = [];
		const n = board[0].length;

		for (let r=t; r < t + h; r++) {
			const sum = board[r].reduce((r,v) => r + v);
			if (sum !== n) continue;

			rows.push(r);

			for (let c=0; c < n; c++) {
				board[r][c] = 0;
			}
		}

		const elmCurrScore = document.querySelector('#scoreCurrent')
		elmCurrScore.innerText = Number(elmCurrScore.innerText) + rows.length * 10;

		while (rows.length) {
			const bot = rows.pop();

			for (let r=bot; r > 0; r--) {
				for (let c=0; c < n; c++) {
					board[r][c] = board[r - 1][c];
				}
			}

			for (let i=0; i < rows.length; i++) {
				rows[i] += 1;
			}
		}
	},
};
boardCtrl.init();

function checkNextPosition() {
	const { l, t, dots } = currentShape.shapeData;
	return validatePosition(dots, t + 1, l);
}
function actionOnDrop() {
	boardCtrl.update();
	boardCtrl.clearRow();

	boardCtrl.drawLastShape();
	elmBoard.removeChild(currentShape);
	currentShape = createShape();
}
function actionTime() {
	const elm = currentShape;
	const { name, l, t, w, h, dots } = elm.shapeData;

	if (checkNextPosition()) {
		elmMoveShape(elm, t + 1, l);

		if (!checkNextPosition()) {
			actionOnDrop();
		}
		return;
	}

	actionOnDrop();
}

let engineInterval;
function startEngine() {
	clearInterval(engineInterval);

	let moveTime = 0;
	let speed = GAME_SPEED;

	engineInterval = setInterval(() => {
		moveTime += INTERVAL;

		actionHandler();

		if (moveTime > speed) {
			actionTime();
			moveTime = 0;
		}
	}, INTERVAL);
}

function startGame() {
	boardCtrl.clear();
	startEngine();
}

document.addEventListener('keydown', (e) => {
	const direction = DIRECTIONS[e.key];

	if (direction === undefined) return;

	if (direction === 'U') {
		actionRotate();
		return;
	}

	action = direction;
});
document.addEventListener('keyup', (e) => {
	action = null;
});

startGame();

