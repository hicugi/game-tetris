const INTERVAL = 50;
const GAME_SPEED = 1000;

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

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
	nextShapeIdx: null,
	currentShapeElm: null,

	get current() {
		const elm = this.currentShapeElm;
		const { name, ...data } = elm.shapeData;

		const dots = this.getDots(name);

		return {
			elm,
			dots,
			name,
			w: dots.w,
			h: dots.h,
			...data,
		};
	},
	set current(elm) {
		this.currentShapeElm = elm;
	},

	init() {
		this.setNextShape();
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

		const l = BOARD_WIDTH / 2 - Math.floor(this.getDots(name).w / 2);
		const t = 0;

		elm.shapeData = {
			name,
			t, l,
		};

		return elm;
	},


	setNextShape() {
		const idx = Math.floor(Math.random() * SHAPE_LIST.length);
		this.nextShapeIdx = idx;

		const elm = document.querySelector('#nextShape');

		for (const name of SHAPE_LIST) {
			elm.classList.remove(name);
		}

		if (elm.childNodes.length != 0) {
			elm.removeChild(elm.childNodes[0]);
		}
		elm.appendChild(shapes.create(idx));
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

	move(elm, t, l) {
		const { w, h } = elm.shapeData;

		const y = (t * SHAPE_SIZE).toFixed(4);
		const x = (l * SHAPE_SIZE).toFixed(4);

		elm.style.transform = `translate(${x}px, ${y}px)`;

		Object.assign(elm.shapeData, { t, l });
	},

	rotate() {
		let { l, t, name, elm } = this.current;

		const variants = SHAPE_GROUP[name.substring(0, name.length - 2)];
		if (variants.length < 2) return;

		const idx = variants.indexOf(name);

		const nextName = variants[(idx + 1) % variants.length];
		const [w, h] = shapes.getDots(nextName);

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
			if (t < 0) return;

			elm.classList.remove(name);
			elm.classList.add(nextName);

			Object.assign(elm.shapeData, {
				name: nextName,
				w, h,
				t, l,
			});

			shapes.move(elm, t, l);
		}
	}
};
shapes.init();

const board = {
	elm: document.querySelector('#board'),
	grid: new Array(BOARD_HEIGHT).fill(0),
	filledRow: parseInt("1".repeat(BOARD_WIDTH), 2),

	init() {
		for (let i = 0; i < this.grid.length; i++) {
			const elm = document.createElement('DIV');
			elm.classList.add('board__item');
			elm.style.top = `${i * SHAPE_SIZE}px`;
			this.elm.appendChild(elm);
		}

		shapes.current = this.createNewShape();
	},

	clear() {
		for (let r = 0; r < this.grid.length; r++) {
			this.grid[r] = 0b0;
		}
	},

	clearRows() {
		const { grid } = this;
		const { t, dots } = shapes.current;

		const rows = [];

		for (let r = t; r < grid.length; r++) {
			if (grid[r] !== this.filledRow) continue;

			rows.push(r);
			grid[r] = 0;
		}

		const elmCurrScore = document.querySelector('#scoreCurrent')
		elmCurrScore.innerText = Number(elmCurrScore.innerText) + rows.length * 10;

		while (rows.length) {
			const bot = rows.pop();

			for (let r = bot; r > 0; r--) {
				grid[r] = grid[r - 1];
			}

			for (let i = 0; i < rows.length; i++) {
				rows[i] += 1;
			}
		}
	},

	createNewShape() {
		const idx = shapes.nextShapeIdx;

		const elm = shapes.create(idx);
		let { name, t, l } = elm.shapeData;
		const dots = shapes.getDots(name);

		for (let i = 0; i < dots.length; i++) {
			if (dots[i] !== 0) break;
			t--;
		}

		if (!validatePosition(name, t, l)) {
			endGame();
			return elm;
		}

		shapes.setNextShape();
		shapes.move(elm, t, l);

		shapes.increaseStatValue(idx);

		board.elm.appendChild(elm);
		return elm;
	},

	drawCurrentShape() {
		const { l, t, dots } = shapes.current;
		const size = dots.length;

		for (let r = 0; r < size; r++) {
			const b = dots[r];

			for (let j = 0; j < size; j++) {
				if (!(b & (1 << j))) continue;
				this.grid[r + t] ^= 1 << l + (size - 1 - j);
			}
		}
	},

	reDraw() {
		const size = SHAPE_SIZE;
		const elms = [...this.elm.querySelectorAll('.board__item')];

		for (let r = 0; r < elms.length; r++) {
			const row = this.grid[r];
			const elm = elms[r];
			const pixels = [];

			for (let c = 0; c < BOARD_WIDTH; c++) {
				pixels.push(
					(row & (1 << c) ? 'var(--color-shape)' : 'transparent') +
					` ${c * size}px ${(c + 1) * size}px`
				);
			}

			elm.style.background = `linear-gradient(to right, ${pixels.join(',')})`;
		}
	},
};
board.init();

/**
 * @param {string} name - Shape name
 * @param {number} y
 * @param {number} x
 */
function validatePosition(name, y, x) {
	const dots = shapes.getDots(name);
	let { l, w, h } = dots;

	if (h + y > BOARD_HEIGHT) return false;
	if (x + l < 0 || w + x > BOARD_WIDTH) return false;

	const size = dots.length;
	for (let i = 0; i < size; i++) {
		const b = dots[i];
		if (b === 0) continue;

		for (let j = 0; j < size; j++) {
			if (!(b & (1 << (size - 1 - j)))) continue;

			if (y + i >= board.grid.length || board.grid[y + i] & 1 << (x + j)) {
				return false;
			}
		}
	}

	return true;
}

let action = null;
let prevLine = BOARD_HEIGHT;

async function actionHandler() {
	if (action === null) return;

	const { elm, name, t, l } = shapes.current;

	if (action === 'L' && validatePosition(name, t, l - 1)) {
		shapes.move(elm, t, l - 1);
		return;
	}

	if (action === 'R' && validatePosition(name, t, l + 1)) {
		shapes.move(elm, t, l + 1);
		return;
	}

	if (action === 'D' && validatePosition(name, t + 1, l)) {
		shapes.move(elm, t + 1, l);
		engine.loopTimer = 0;

		if (!validatePosition(name, t + 2, l)) {
			engine.actionOnDrop();
		}
		return;
	}
}

const wait = (t) => new Promise((ok) => setTimeout(ok, t));

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
		this.isPaused = false;
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
	stop() {
		clearInterval(this.engineInterval);
		this.loopTimer = 0;
		this.isPaused = true;
	},

	async loop() {
		let { elm, name, l, t, dots } = shapes.current;

		if (validatePosition(name, t + 1, l)) {
			t += 1;
			shapes.move(elm, t, l);

			await wait(128);

			if (validatePosition(name, shapes.current.t + 1, shapes.current.l)) {
				return;
			}
		}

		this.actionOnDrop();
	},

	async actionOnDrop() {
		await wait(0);

		board.drawCurrentShape();
		board.clearRows();

		board.reDraw();
		board.elm.removeChild(shapes.current.elm);
		shapes.current = board.createNewShape();

		this.delay(500);
	},
};

function startGame() {
	board.clear();
	engine.start();

	ui.hideStartGameDialog();
}
function reStartGame() {
	board.clear();
	board.reDraw();

	shapes.current = board.createNewShape();
	engine.start();

	ui.hideEndGameDialog();
}
function endGame() {
	engine.stop();

	const current = document.querySelector('#scoreCurrent');
	const newValue = current.innerText;
	current.innerText = '0';
	const elm = document.querySelector('#scoreTop');
	elm.innerText = Math.max(elm.innerText, newValue);

	ui.showEndGameDialog();
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
		shapes.rotate();
	}
});

const ui = {
	startGameDialog: null,
	endGameDialog: null,

	/**
	 * @param {string} text
	 * @param {function} event
	 */
	createBtn(text, event) {
		const btn = document.createElement('BUTTON');

		btn.innerText = text;

		const span = document.createElement('SPAN');
		btn.appendChild(span);

		btn.className = 'btn';
		btn.addEventListener('click', event);

		return btn;
	},

	createDialog(id, content) {
		const dialog = document.querySelector('#dialogTemplate').content.cloneNode(true);
		dialog.id = id;

		dialog.querySelector('[dialog-body]').appendChild(content);

		return dialog.querySelector('.dialog');
	},
	getDialog(value) {
		return typeof value !== 'string' ? value : document.querySelector(`#${value}`);
	},
	openDialog(value) {
		this.getDialog(value).classList.remove('dialog--hide');
	},
	hideDialog(value) {
		this.getDialog(value).classList.add('dialog--hide');
	},

	initStartGameDialog() {
		const body = document.createElement('DIV');

		const title = document.createElement('H2');
		title.className = 'startGame__title';
		title.innerText = 'TETRIS';
		const btn = ui.createBtn('START', startGame);

		body.appendChild(title);
		body.appendChild(btn);
		const dialog = ui.createDialog('startGameDialog', body);

		document.body.appendChild(dialog);

		ui.startGameDialog = dialog;

		setTimeout(() => {
			btn.focus();
		});
	},
	hideStartGameDialog() {
		this.hideDialog(this.startGameDialog);
	},

	showEndGameDialog() {
		if (this.endGameDialog) {
			this.openDialog(this.endGameDialog);
			return;
		}

		const body = document.createElement('DIV');

		const title = document.createElement('H2');
		title.className = 'endGame__title';
		title.innerText = 'GAME OVER';
		const btn = ui.createBtn('RESTART', reStartGame);

		body.appendChild(title);
		body.appendChild(btn);
		const dialog = ui.createDialog('endGameDialog', body);

		document.body.appendChild(dialog);

		ui.endGameDialog = dialog;

		setTimeout(() => {
			btn.focus();
		});
	},
	hideEndGameDialog() {
		this.hideDialog(this.endGameDialog);
	},
};

ui.initStartGameDialog();

