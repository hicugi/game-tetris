const SHAPE_SIZE = 40;
const SHAPE_LIST = [
	'shape-f', 'shape-f_2', 'shape-f_3', 'shape-f_4',
	'shape-leg', 'shape-leg_2', 'shape-leg_3', 'shape-leg_4',
	'shape-leg_r', 'shape-leg_r2', 'shape-leg_r3', 'shape-leg_r4',
	'shape-z', 'shape-z_2', 'shape-z_r', 'shape-z_r2',
	'shape-square',
	'shape-line', 'shape-line_2',
];

function getRandomShape() {
}

function setNextShape() {
	const elm = document.querySelector('#nextShape');

	for (const name of SHAPE_LIST) {
		elm.classList.remove(name);
	}

	const idx = Math.floor(Math.random() * SHAPE_LIST.length);
	elm.classList.add(SHAPE_LIST[idx]);
}

function startGame() {
	setNextShape();
}

startGame();
