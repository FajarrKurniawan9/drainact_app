/**
 * Small motion toolkit built around Apple's fluid-interface rules:
 * feedback on press, springs for spatial change, and reduced-motion fallbacks.
 * Everything is dependency-free and animates only transform/opacity.
 */

export const reducedMotion = () =>
	typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const isFinePointer = () =>
	typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches;

type RevealOptions = {
	delay?: number;
	threshold?: number;
	y?: number;
	once?: boolean;
};

/** Fade-and-rise an element when it scrolls into view. */
export function reveal(node: HTMLElement, options: RevealOptions = {}) {
	const { delay = 0, threshold = 0.16, y = 18, once = true } = options;
	if (reducedMotion()) {
		node.classList.add('is-in');
		return {};
	}

	node.style.opacity = '0';
	node.style.transform = `translate3d(0, ${y}px, 0)`;
	node.style.transition = `opacity .7s var(--ease-out) ${delay}ms, transform .9s var(--ease-spring) ${delay}ms`;
	node.style.willChange = 'opacity, transform';

	const io = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					node.style.opacity = '1';
					node.style.transform = 'none';
					if (once) io.unobserve(node);
				} else if (!once) {
					node.style.opacity = '0';
					node.style.transform = `translate3d(0, ${y}px, 0)`;
				}
			}
		},
		{ threshold, rootMargin: '0px 0px -8% 0px' }
	);

	io.observe(node);
	return {
		destroy() {
			io.disconnect();
		}
	};
}

type CounterOptions = {
	value: number;
	duration?: number;
	decimals?: number;
	prefix?: string;
	suffix?: string;
	separator?: string;
};

/** Count up to a number with an ease-out curve, once it is visible. */
export function counter(node: HTMLElement, options: CounterOptions) {
	let raf = 0;
	let started = false;

	const format = (n: number) => {
		const fixed = n.toFixed(options.decimals ?? 0);
		const [whole, frac] = fixed.split('.');
		const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, options.separator ?? '.');
		return `${options.prefix ?? ''}${grouped}${frac ? ',' + frac : ''}${options.suffix ?? ''}`;
	};

	const run = () => {
		if (started) return;
		started = true;
		const target = options.value;
		const duration = options.duration ?? 1100;
		if (reducedMotion()) {
			node.textContent = format(target);
			return;
		}
		const start = performance.now();
		const tick = (now: number) => {
			const t = Math.min(1, (now - start) / duration);
			const eased = 1 - Math.pow(1 - t, 3);
			node.textContent = format(target * eased);
			if (t < 1) raf = requestAnimationFrame(tick);
			else node.textContent = format(target);
		};
		node.textContent = format(0);
		raf = requestAnimationFrame(tick);
	};

	const io = new IntersectionObserver(
		(entries) => {
			if (entries.some((e) => e.isIntersecting)) {
				run();
				io.disconnect();
			}
		},
		{ threshold: 0.4 }
	);
	io.observe(node);
	node.textContent = format(options.value);

	return {
		update(next: CounterOptions) {
			options = next;
			started = false;
			run();
		},
		destroy() {
			cancelAnimationFrame(raf);
			io.disconnect();
		}
	};
}

/** Toggle a class on an element while the page is scrolled past a threshold. */
export function scrolled(node: HTMLElement, threshold = 12) {
	let ticking = false;
	const onScroll = () => {
		if (ticking) return;
		ticking = true;
		requestAnimationFrame(() => {
			node.classList.toggle('is-scrolled', window.scrollY > threshold);
			ticking = false;
		});
	};
	onScroll();
	window.addEventListener('scroll', onScroll, { passive: true });
	return {
		destroy() {
			window.removeEventListener('scroll', onScroll);
		}
	};
}

/**
 * Subtle pointer tilt for a hero surface. Deliberately restrained:
 * max 3.5deg, springs back on leave, disabled for touch/reduced motion.
 */
export function tilt(node: HTMLElement, max = 3.5) {
	if (!isFinePointer() || reducedMotion()) return {};
	let raf = 0;
	const onMove = (e: PointerEvent) => {
		const r = node.getBoundingClientRect();
		const px = (e.clientX - r.left) / r.width - 0.5;
		const py = (e.clientY - r.top) / r.height - 0.5;
		cancelAnimationFrame(raf);
		raf = requestAnimationFrame(() => {
			node.style.transform = `perspective(1200px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg) translateZ(0)`;
		});
	};
	const onLeave = () => {
		cancelAnimationFrame(raf);
		node.style.transform = 'perspective(1200px) rotateX(0deg) rotateY(0deg)';
	};
	node.style.transition = 'transform .5s var(--ease-spring)';
	node.addEventListener('pointermove', onMove);
	node.addEventListener('pointerleave', onLeave);
	return {
		destroy() {
			cancelAnimationFrame(raf);
			node.removeEventListener('pointermove', onMove);
			node.removeEventListener('pointerleave', onLeave);
		}
	};
}

/** Press feedback: scale down on pointer-down, spring back on release. */
export function press(node: HTMLElement) {
	const down = () => node.classList.add('is-pressed');
	const up = () => node.classList.remove('is-pressed');
	const onKey = (e: KeyboardEvent) => {
		if (e.key === ' ' || e.key === 'Enter') down();
	};
	const offKey = () => up();
	node.addEventListener('pointerdown', down);
	node.addEventListener('pointerup', up);
	node.addEventListener('pointercancel', up);
	node.addEventListener('pointerleave', up);
	node.addEventListener('keydown', onKey);
	node.addEventListener('keyup', offKey);
	node.addEventListener('blur', offKey);
	return {
		destroy() {
			node.removeEventListener('pointerdown', down);
			node.removeEventListener('pointerup', up);
			node.removeEventListener('pointercancel', up);
			node.removeEventListener('pointerleave', up);
			node.removeEventListener('keydown', onKey);
			node.removeEventListener('keyup', offKey);
			node.removeEventListener('blur', offKey);
		}
	};
}

/** Format helpers shared by counters and lists. */
export const fmt = {
	/** 12.408 */
	num: (n: number) => new Intl.NumberFormat('id-ID').format(n),
	/** Rp 62.500 */
	rp: (n: number) => 'Rp ' + new Intl.NumberFormat('id-ID').format(n)
};
