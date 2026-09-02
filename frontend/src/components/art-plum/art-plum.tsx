"use client";

import { useEffect, useRef } from "react";

type CanvasContextWithBackingStore = CanvasRenderingContext2D & {
	webkitBackingStorePixelRatio?: number;
	mozBackingStorePixelRatio?: number;
	msBackingStorePixelRatio?: number;
	oBackingStorePixelRatio?: number;
	backingStorePixelRatio?: number;
};

type Step = () => void;

const R180 = Math.PI;
const R90 = Math.PI / 2;
const R15 = Math.PI / 12;
const STROKE_COLOR = "#88888825";
const MIN_BRANCH = 30;
const BRANCH_LENGTH = 6;
const FRAME_INTERVAL = 1000 / 40;
const MASK_IMAGE = "radial-gradient(circle, transparent, black)";

function initCanvas(
	canvas: HTMLCanvasElement,
	width = 400,
	height = 400,
	dpi?: number,
) {
	const ctx = canvas.getContext("2d") as CanvasContextWithBackingStore | null;

	if (!ctx) {
		return null;
	}

	const dpr = window.devicePixelRatio || 1;
	const bsr =
		ctx.webkitBackingStorePixelRatio ||
		ctx.mozBackingStorePixelRatio ||
		ctx.msBackingStorePixelRatio ||
		ctx.oBackingStorePixelRatio ||
		ctx.backingStorePixelRatio ||
		1;
	const canvasDpi = dpi || dpr / bsr;

	canvas.style.width = `${width}px`;
	canvas.style.height = `${height}px`;
	canvas.width = canvasDpi * width;
	canvas.height = canvasDpi * height;
	ctx.setTransform(canvasDpi, 0, 0, canvasDpi, 0, 0);

	return { ctx, dpi: canvasDpi };
}

function polar2cart(x = 0, y = 0, r = 0, theta = 0) {
	const dx = r * Math.cos(theta);
	const dy = r * Math.sin(theta);

	return [x + dx, y + dy] as const;
}

function randomMiddle() {
	return Math.random() * 0.6 + 0.2;
}

export function ArtPlum() {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);

	useEffect(() => {
		const canvas = canvasRef.current;

		if (!canvas) {
			return;
		}

		let animationFrame = 0;
		let lastTime = performance.now();
		let isRunning = false;
		let steps: Step[] = [];
		let prevSteps: Step[] = [];
		let size = {
			width: window.innerWidth,
			height: window.innerHeight,
		};

		const setupCanvas = () => {
			const result = initCanvas(canvas, size.width, size.height);

			if (!result) {
				return null;
			}

			result.ctx.lineWidth = 1;
			result.ctx.strokeStyle = STROKE_COLOR;

			return result.ctx;
		};

		const initialContext = setupCanvas();

		if (!initialContext) {
			return;
		}

		let ctx = initialContext;

		const step = (
			x: number,
			y: number,
			rad: number,
			counter: { value: number } = { value: 0 },
		) => {
			const length = Math.random() * BRANCH_LENGTH;
			counter.value += 1;

			const [nx, ny] = polar2cart(x, y, length, rad);

			ctx.beginPath();
			ctx.moveTo(x, y);
			ctx.lineTo(nx, ny);
			ctx.stroke();

			const rad1 = rad + Math.random() * R15;
			const rad2 = rad - Math.random() * R15;

			if (
				nx < -100 ||
				nx > size.width + 100 ||
				ny < -100 ||
				ny > size.height + 100
			) {
				return;
			}

			const rate = counter.value <= MIN_BRANCH ? 0.8 : 0.5;

			if (Math.random() < rate) {
				steps.push(() => step(nx, ny, rad1, counter));
			}

			if (Math.random() < rate) {
				steps.push(() => step(nx, ny, rad2, counter));
			}
		};

		const frame = () => {
			if (!isRunning) {
				return;
			}

			animationFrame = window.requestAnimationFrame(frame);

			if (performance.now() - lastTime < FRAME_INTERVAL) {
				return;
			}

			prevSteps = steps;
			steps = [];
			lastTime = performance.now();

			if (!prevSteps.length) {
				isRunning = false;
				window.cancelAnimationFrame(animationFrame);
				return;
			}

			for (const item of prevSteps) {
				if (Math.random() < 0.5) {
					steps.push(item);
				} else {
					item();
				}
			}
		};

		const start = () => {
			if (animationFrame) {
				window.cancelAnimationFrame(animationFrame);
			}

			ctx.clearRect(0, 0, size.width, size.height);
			ctx.lineWidth = 1;
			ctx.strokeStyle = STROKE_COLOR;
			prevSteps = [];
			steps = [
				() => step(randomMiddle() * size.width, -5, R90),
				() => step(randomMiddle() * size.width, size.height + 5, -R90),
				() => step(-5, randomMiddle() * size.height, 0),
				() => step(size.width + 5, randomMiddle() * size.height, R180),
			];

			if (size.width < 500) {
				steps = steps.slice(0, 2);
			}

			isRunning = true;
			lastTime = performance.now();
			animationFrame = window.requestAnimationFrame(frame);
		};

		const handleResize = () => {
			size = {
				width: window.innerWidth,
				height: window.innerHeight,
			};

			const nextContext = setupCanvas();

			if (!nextContext) {
				return;
			}

			ctx = nextContext;
			start();
		};

		start();
		window.addEventListener("resize", handleResize, { passive: true });

		return () => {
			isRunning = false;
			window.cancelAnimationFrame(animationFrame);
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return (
		<div
			className="pointer-events-none fixed inset-0 print:hidden"
			style={{
				zIndex: -1,
				maskImage: MASK_IMAGE,
				WebkitMaskImage: MASK_IMAGE,
			}}
		>
			<canvas ref={canvasRef} height={400} width={400} />
		</div>
	);
}
