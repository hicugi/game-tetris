const INTERVAL = 50;
const GAME_SPEED = 1000;

const BOARD_SIZE = [10, 20];
const SHAPE_SIZE = 32;
const SHAPE_LIST = [
	'shape-f_1', 'shape-f_2', 'shape-f_3', 'shape-f_4',
	'shape-leg_1', 'shape-leg_2', 'shape-leg_3', 'shape-leg_4',
	'shape-legr_1', 'shape-legr_2', 'shape-legr_3', 'shape-legr_4',
	'shape-z_1', 'shape-z_2', 'shape-z_3', 'shape-z_4',
	'shape-zr_1', 'shape-zr_2', 'shape-zr_3', 'shape-zr_4',
	'shape-square_1',
	'shape-line_1', 'shape-line_2', 'shape-line_3', 'shape-line_4',
];

const SHAPE_DOTS = {
	'f_1': [0b010, 0b111, 0b000], 'f_2': [0b010, 0b011, 0b010], 'f_3': [0b000, 0b111, 0b010], 'f_4': [0b010, 0b110, 0b010],
	'leg_1': [0b111, 0b100, 0b000], 'leg_2': [0b011, 0b001, 0b001], 'leg_3': [0b000, 0b001, 0b111], 'leg_4': [0b100, 0b100, 0b110],
	'legr_1': [0b111, 0b001, 0b000], 'legr_2': [0b001, 0b001, 0b011], 'legr_3': [0b000, 0b100, 0b111], 'legr_4': [0b110, 0b100, 0b100],
	'z_1': [0b110, 0b011, 0b000], 'z_2': [0b001, 0b011, 0b010], 'z_3': [0b000, 0b110, 0b011], 'z_4': [0b010, 0b110, 0b100],
	'zr_1': [0b011, 0b110, 0b000], 'zr_2': [0b010, 0b011, 0b001], 'zr_3': [0b000, 0b011, 0b110], 'zr_4': [0b100, 0b110, 0b010],
	'square_1': [0b11, 0b11],
	'line_1': [0b0000, 0b1111, 0b0000, 0b0000], 'line_2': [0b0010, 0b0010, 0b0010, 0b0010], 'line_3': [0b0000, 0b0000, 0b1111, 0b0000], 'line_4': [0b0100, 0b0100, 0b0100, 0b0100],
};

const SHAPE_GROUP = {
	'shape-f': ['shape-f_1', 'shape-f_2', 'shape-f_3', 'shape-f_4'],
	'shape-leg': ['shape-leg_1', 'shape-leg_2', 'shape-leg_3', 'shape-leg_4'],
	'shape-legr': ['shape-legr_1', 'shape-legr_2', 'shape-legr_3', 'shape-legr_4'],
	'shape-z': ['shape-z_1', 'shape-z_2', 'shape-z_3', 'shape-z_4'],
	'shape-zr': ['shape-zr_1', 'shape-zr_2', 'shape-zr_3', 'shape-zr_4'],
	'shape-square': ['shape-square_1'],
	'shape-line': ['shape-line_1', 'shape-line_2', 'shape-line_3', 'shape-line_4'],
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

const shapes = {
	get current() {
		const elm = currentShape;
		const { name, ...data } = elm.shapeData;

		return {
			elm,
			dots: this.getDots(name),
			name,
			...data,
		};
	},
	init() {
		this.initStatsElms();
		this.initDotSizes();
	},

	/**
	 * @param {number} idx
	 * @param {boolean} skipExtraParams - Don't create shapeData which related to board
	 */
	create(idx, skipExtraParams = false) {
		const elm = document.createElement('DIV');
		elm.appendChild(document.createElement('DIV'));

		const name = SHAPE_LIST[idx];
		const groupName = this.getGroup(idx);
		elm.className = `shape ${groupName} ${name}`;

		if (skipExtraParams) {
			return elm;
		}

		const l = BOARD_SIZE[0] / 2 - Math.floor(this.getDots(name).w / 2);
		const t = 0;

		elm.shapeData = {
			name,
			t, l,
		};

		return elm;
	},

	/**
	 * @param {string} name
	 */
	getDots(name) {
		return SHAPE_DOTS[name.replace('shape-', '')];
	},

	/**
	 * @param {number} idx
	 */
	getGroup(idx) {
		const s = SHAPE_LIST[idx];
		return s.substring(0, s.length - 2);
	},

	/**
	 * @param {number} idx
	 */
	getName(idx) {
		return SHAPE_LIST[idx];
	},

	/**
	 * @param {number} idx
	 * @param {number} value
	 */
	increaseStatValue(idx, value) {
		const groupName = this.getGroup(idx);
		const elm = document.querySelector(`.stats [name='${groupName}']`);

		elm.innerText = Number(elm.innerText) + 1;
	},

	initDotSizes() {
		for (const key in SHAPE_DOTS) {
			const dots = SHAPE_DOTS[key];
			const size = dots.length;

			for (let i = 0; i < dots.length; i++) {
				const b = dots[i];

				if (b === 0) continue;

				dots.h = i + 1;
				dots.w = Math.max(dots.w ?? 0, size - ((b & (-b)).toString(2).length - 1));
				dots.l = Math.min(dots.l ?? Infinity, size - b.toString(2).length);
			}
		}
	},

	initStatsElms() {
		const list = [0, 4, 8, 12, 16, 20, 21];

		for (const idx of list) {
			const groupName = this.getGroup(idx);
			const elm = this.create(idx, true);

			document.querySelector(`.stats [name='icon-${groupName}`).appendChild(elm);
		}
	},
};
shapes.init();

const board = Array.from({ length: BOARD_SIZE[1] }, () => new Array(BOARD_SIZE[0]).fill(0));

Object.assign(board, {
	clear() {
		for (let r = 0; r < board.length; r++) {
			for (let c = 0; c < board[0].length; c++) {
				board[r][c] = 0;
			}
		}
	},
});

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

function rotateShape(elm) {
	let { l, t, name } = elm.shapeData;

	const variants = SHAPE_GROUP[name.substring(0, name.length - 2)];
	if (variants.length < 2) return;

	const idx = variants.indexOf(name);

	const nextName = variants[(idx + 1) % variants.length];
	const [w, h, dots] = shapes.getDots(nextName);

	const isRotatoable = (() => {
		if (validatePosition(nextName, t, l)) return true;

		for (let i = 1; i <= 2; i++) {
			if (validatePosition(nextName, t, l - i)) {
				isLeftPosValid = true;
				l -= i;
				return true;
			}
			if (validatePosition(nextName, t, l + i)) {
				isLeftPosValid = true;
				l += i;
				return true;
			}
		}

		return false;
	})();

	if (isRotatoable) {
		elm.classList.remove(name);
		elm.classList.add(nextName);

		Object.assign(elm.shapeData, {
			name: nextName,
			w, h,
			t, l,
		});

		elmMoveShape(elm, t, l);
	}
}

function createBoardShape() {
	const idx = nextShapeIdx;

	const elm = shapes.create(idx);
	const { t, l } = elm.shapeData;

	setNextShape();
	elmMoveShape(elm, t, l);

	shapes.increaseStatValue(idx);

	elmBoard.appendChild(elm);
	return elm;
}

/**
 * @param {string} name - Shape name
 * @param {number} y
 * @param {number} x
 */
function validatePosition(name, y, x) {
	const dots = shapes.getDots(name);
	let { l, w, h } = dots;

	if (h + y > BOARD_SIZE[1]) return false;
	if (x + l < 0 || w + x > BOARD_SIZE[0]) return false;

	const size = dots.length;
	for (let i = 0; i < size; i++) {
		const b = dots[i];
		if (b === 0) continue;

		for (let j = 0; j < size; j++) {
			if (!(b & (1 << (size - 1 - j)))) continue;

			if (board[y + i] === undefined || board[y + i][x + j] === 1) {
				return false;
			}
		}
	}

	return true;
}

let currentShape = createBoardShape();
let action = null;
let prevLine = BOARD_SIZE[1];

function actionHandler() {
	if (action === null) return;

	const elm = currentShape;
	const { name, t, l, w, h, dots } = elm.shapeData;

	if (action === 'L' && validatePosition(name, t, l - 1)) {
		elmMoveShape(elm, t, l - 1);
		return;
	}

	if (action === 'R' && validatePosition(name, t, l + 1)) {
		elmMoveShape(elm, t, l + 1);
		return;
	}

	if (action === 'D' && validatePosition(name, t + 1, l)) {
		elmMoveShape(elm, t + 1, l);
		return;
	}
}
function actionRotate() {
	const elm = currentShape;
	const { t, l, w, h, dots } = elm.shapeData;

	rotateShape(elm);
}

(function drawBoard() {
	for (let i = 0; i < board.length; i++) {
		const elm = document.createElement('DIV');
		elm.classList.add('board__item');
		elm.style.top = `${i * SHAPE_SIZE}px`;
		elmBoard.appendChild(elm);
	}
})();

function reDrawBoard() {
	const size = SHAPE_SIZE;
	const elms = [...elmBoard.querySelectorAll('.board__item')];

	for (let r = 0; r < board.length; r++) {
		const elm = elms[r];

		const value = board[r].map((v, i) => (v === 1 ? '#000' : 'transparent') + ` ${i * size}px ${(i + 1) * size}px`).join(', ');
		elm.style.background = `linear-gradient(to right, ${value})`;
	}
}

const engine = {
	interval: null,
	isPaused: false,
	loopTimer: 0,

	/**
	* @param {number} time
	*/
	delay(time) {
		this.isPaused = true;

		setTimeout(() => {
			this.isPaused = false;
			this.loopTimer = 0;
		}, time);
	},

	start() {
		clearInterval(this.engineInterval);

		this.engineInterval = setInterval(() => {
			this.loopTimer += INTERVAL;

			if (this.isPaused) return;

			actionHandler();

			if (this.loopTimer > GAME_SPEED) {
				this.loop();
				this.loopTimer = 0;
			}
		}, INTERVAL);
	},

	async loop() {
		let { elm, name, l, t, dots } = shapes.current;

		if (validatePosition(name, t + 1, l)) {
			t += 1;
			elmMoveShape(elm, t, l);

			await new Promise((ok) => setTimeout(ok, 128));

			if (validatePosition(name, shapes.current.t + 1, shapes.current.l)) {
				return;
			}
		}

		l = shapes.current.l;
		t = shapes.current.t;
		const { h } = dots;

		// paint new shape into board
		const size = dots.length;
		for (let i = 0; i < size; i++) {
			const b = dots[i];

			for (let j = 0; j < size; j++) {
				if (b & (1 << j)) {
					board[t + i][l + (size - 1 - j)] = 1;
				}
			}
		}

		// clear rows
		(() => {
			const rows = [];
			const n = board[0].length;

			for (let r = t; r < t + h; r++) {
				const sum = board[r].reduce((r, v) => r + v);
				if (sum !== n) continue;

				rows.push(r);

				for (let c = 0; c < n; c++) {
					board[r][c] = 0;
				}
			}

			const elmCurrScore = document.querySelector('#scoreCurrent')
			elmCurrScore.innerText = Number(elmCurrScore.innerText) + rows.length * 10;

			while (rows.length) {
				const bot = rows.pop();

				for (let r = bot; r > 0; r--) {
					for (let c = 0; c < n; c++) {
						board[r][c] = board[r - 1][c];
					}
				}

				for (let i = 0; i < rows.length; i++) {
					rows[i] += 1;
				}
			}
		})();

		reDrawBoard();
		elmBoard.removeChild(currentShape);
		currentShape = createBoardShape();

		this.delay(1000);
	},
};

function startGame() {
	board.clear();
	engine.start();
}

document.addEventListener('keydown', (e) => {
	const direction = DIRECTIONS[e.key];

	if (direction === undefined) return;

	action = direction;
});
document.addEventListener('keyup', (e) => {
	action = null;

	if (e.key == "Escape") {
		engine.isPaused = !engine.isPaused;
	}

	const direction = DIRECTIONS[e.key];

	if (direction === 'U') {
		actionRotate();
	}
});

startGame();

