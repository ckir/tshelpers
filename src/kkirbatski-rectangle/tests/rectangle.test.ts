import Rectangle, { AlignHorz, AlignVert, AspectRatioMode } from '../src/Rectangle';

describe('constructor', () => {
	test('empty', () => {
		const r = new Rectangle();
		expect(r.x).toBe(0);
		expect(r.y).toBe(0);
		expect(r.width).toBe(0);
		expect(r.height).toBe(0);
	});

	test('not empty', () => {
		const r = new Rectangle(1,2,3,4);
		expect(r.x).toBe(1);
		expect(r.y).toBe(2);
		expect(r.width).toBe(3);
		expect(r.height).toBe(4);
	});
});

describe('set', () => {
	test('partial', () => {
		const r = new Rectangle(1,2,3,4);
		r.set(undefined, 5, 6, undefined);
		expect(r.y).toBe(5);
		expect(r.width).toBe(6);
	});

	test('all', () => {
		const r = new Rectangle(1,2,3,4);
		r.set(5, 6, 7, 8);
		expect(r.x).toBe(5);
		expect(r.y).toBe(6);
		expect(r.width).toBe(7);
		expect(r.height).toBe(8);
	})
});

describe('position', () => {
	const rect = new Rectangle(1,2,3,4);
	test('top', () => {
		expect(rect.top).toBe(2);
	});
	test('right', () => {
		expect(rect.right).toBe(4);
	});
	test('bottom', () => {
		expect(rect.bottom).toBe(6);
	});
	test('left', () => {
		expect(rect.left).toBe(1);
	});
});

test('setFromVec2', () => {
	const rect = new Rectangle();
	rect.setFromVec2({
		x: 1,
		y: 2,
	}, 3, 4);
	expect(rect.x).toBe(1);
	expect(rect.y).toBe(2);
	expect(rect.width).toBe(3);
	expect(rect.height).toBe(4);
});

test('setFromRect', () => {
	const rectA = new Rectangle(1,2,3,4);
	const rectB = new Rectangle();
	rectB.setFromRect(rectA);
	expect(rectB.x).toBe(1);
	expect(rectB.y).toBe(2);
	expect(rectB.width).toBe(3);
	expect(rectB.height).toBe(4);
});

describe('setFromCorners', () => {
	test('positive', () => {
		const rect = new Rectangle();
		rect.setFromCorners({
			x: 1,
			y: 2,
		}, {
			x: 3,
			y: 4,
		});
		expect(rect.x).toBe(1);
		expect(rect.y).toBe(2);
		expect(rect.width).toBe(2);
		expect(rect.height).toBe(2);
	});

	test('negative', () => {
		const rect = new Rectangle();
		rect.setFromCorners({
			x: -10,
			y: -20,
		}, {
			x: 10,
			y: 20,
		});

		expect(rect.x).toBe(-10);
		expect(rect.y).toBe(-20);
		expect(rect.width).toBe(20);
		expect(rect.height).toBe(40);
	});
});

describe('position', () => {
	test('get', () => {
		const rect = new Rectangle(1,2,3,4);
		expect(rect.position).toEqual({
			x: 1,
			y: 2,
		});
	});

	test('set', () => {
		const rect = new Rectangle(1,2,3,4);
		rect.position = {
			x: 5,
			y: 6,
		};
		expect(rect.x).toBe(5);
		expect(rect.y).toBe(6);
	});
});

describe('size', () => {
	test('get', () => {
		const rect = new Rectangle(1,2,3,4);
		expect(rect.size).toEqual({
			x: 3,
			y: 4,
		});
	});
	test('set', () => {
		const rect = new Rectangle(1,2,3,4);
		rect.size = {
			x: 5,
			y: 6,
		};
		expect(rect.width).toBe(5);
		expect(rect.height).toBe(6);
	});
});

test('get center', () => {
	const rect = new Rectangle(1,2,3,4);
	expect(rect.center).toEqual({
		x: 2.5,
		y: 4
	});
});

test('setFromCenter', () => {
	const rect = new Rectangle(1,2,3,4);
	rect.setFromCenter(0, 0, 10, 20);
	expect(rect.x).toBe(-5);
	expect(rect.y).toBe(-10);
	expect(rect.width).toBe(10);
	expect(rect.height).toBe(20);
});

test('setFromCenterVec2', () => {
	const rect = new Rectangle(1,2,3,4);
	rect.setFromCenterVec2({x: -10, y: -10}, 10, 20);
	expect(rect.x).toBe(-15);
	expect(rect.y).toBe(-20);
	expect(rect.width).toBe(10);
	expect(rect.height).toBe(20);
});

describe('translate', () => {

	test('translateX', () => {
		const rect = new Rectangle(1,2,3,4);
		rect.translateX(5);
		expect(rect.x).toBe(6);
	});

	test('translateY', () => {
		const rect = new Rectangle(1,2,3,4);
		rect.translateY(-5);
		expect(rect.y).toBe(-3);
	});

	test('translate', () => {
		const rect = new Rectangle(1,2,3,4);
		rect.translate(5, -5);
		expect(rect.x).toBe(6);
		expect(rect.y).toBe(-3);
	});

	test('translateVec2', () => {
		const rect = new Rectangle(1,2,3,4);
		rect.translateVec2({x: -5, y: 5});
		expect(rect.x).toBe(-4);
		expect(rect.y).toBe(7);
	});
});

describe('getHorzAnchor', () => {
	const rect = new Rectangle(1,2,3,4);
	test('left', () => {
		expect(rect.getHorzAnchor(AlignHorz.LEFT)).toBe(1);
	});
	test('center', () => {
		expect(rect.getHorzAnchor(AlignHorz.CENTER)).toBe(2.5);
	});
	test('right', () => {
		expect(rect.getHorzAnchor(AlignHorz.RIGHT)).toBe(4);
	});
});

describe('getVertAnchor', () => {
	const rect = new Rectangle(1,2,3,4);
	test('top', () => {
		expect(rect.getVertAnchor(AlignVert.TOP)).toBe(2);
	});
	test('center', () => {
		expect(rect.getVertAnchor(AlignVert.CENTER)).toBe(4);
	});
	test('bottom', () => {
		expect(rect.getVertAnchor(AlignVert.BOTTOM)).toBe(6);
	});
});

describe('alignTo', () => {
	describe('vert', () => {
		test('top', () => {
			const rect = new Rectangle(1,2,3,4);
			rect.alignToVert(10, AlignVert.TOP);
			expect(rect.y).toBe(10);
		});

		test('center', () => {
			const rect = new Rectangle(1,2,3,4);
			rect.alignToVert(10, AlignVert.CENTER);
			expect(rect.y).toBe(8);
		});

		test('bottom', () => {
			const rect = new Rectangle(1,2,3,4);
			rect.alignToVert(10, AlignVert.BOTTOM);
			expect(rect.y).toBe(6);
		});
	});
	describe('horz', () => {
		test('left', () => {
			const rect = new Rectangle(1,2,3,4);
			rect.alignToHorz(10, AlignHorz.LEFT);
			expect(rect.x).toBe(10);
		});
		test('center', () => {
			const rect = new Rectangle(1,2,3,4);
			rect.alignToHorz(10, AlignHorz.CENTER);
			expect(rect.x).toBe(8.5);
		});
		test('right', () => {
			const rect = new Rectangle(1,2,3,4);
			rect.alignToHorz(10, AlignHorz.RIGHT);
			expect(rect.x).toBe(7);
		});
	});

	describe('rect', () => {
		describe('horz', () => {
			test('center/center', () => {
				const rect = new Rectangle(0,0,10,10); // center = 5, 5
				const rect2 = new Rectangle(10,10,20,20); // center = 20, 20
				rect.alignToHorzRect(rect2, AlignHorz.CENTER, AlignHorz.CENTER);
				expect(rect.x).toBe(15);
			});
			test('center/right', () => {
				const rect = new Rectangle(0,0,10,10); // center = 5
				const rect2 = new Rectangle(10,10,20,20); // right = 40
				rect.alignToHorzRect(rect2, AlignHorz.RIGHT, AlignHorz.CENTER);
				expect(rect.x).toBe(25);
			});
			test('center/left', () => {
				const rect = new Rectangle(0,0,10,10); // center = 5
				const rect2 = new Rectangle(10,10,20,20); // right = 40
				rect.alignToHorzRect(rect2, AlignHorz.LEFT, AlignHorz.CENTER);
				expect(rect.x).toBe(5);
			});

			test('left/right', () => {
				const rect = new Rectangle(0,0,10,10); // center = 5, 5
				const rect2 = new Rectangle(10,10,20,20); // center = 20, 20
				rect.alignToHorzRect(rect2, AlignHorz.RIGHT, AlignHorz.LEFT);
				expect(rect.x).toBe(30);
			});
			test('right/center', () => {
				const rect = new Rectangle(0,0,10,10); // center = 5
				const rect2 = new Rectangle(10,10,20,20); // right = 40
				rect.alignToHorzRect(rect2, AlignHorz.CENTER, AlignHorz.RIGHT);
				expect(rect.x).toBe(10);
			});
			test('right/left', () => {
				const rect = new Rectangle(0,0,10,10); // center = 5
				const rect2 = new Rectangle(10,10,20,20); // right = 40
				rect.alignToHorzRect(rect2, AlignHorz.LEFT, AlignHorz.RIGHT);
				expect(rect.x).toBe(0);
			});

			test('right/left negative', () => {
				const rect = new Rectangle(0,0,10,10); // center = 5
				const rect2 = new Rectangle(0,0,20,20); // right = 40
				rect.alignToHorzRect(rect2, AlignHorz.LEFT, AlignHorz.RIGHT);
				expect(rect.x).toBe(-10);
			});
		});

		describe('vert', () => {
			test('center/center', () => {
				const rect = new Rectangle(0,0,10,10); // center = 5, 5
				const rect2 = new Rectangle(10,10,20,20); // center = 20, 20
				rect.alignToVertRect(rect2, AlignVert.CENTER, AlignVert.CENTER);
				expect(rect.y).toBe(15);
			});
			test('center/bottom', () => {
				const rect = new Rectangle(0,0,10,10); // center = 5
				const rect2 = new Rectangle(10,10,20,20); // right = 40
				rect.alignToVertRect(rect2, AlignVert.BOTTOM, AlignVert.CENTER);
				expect(rect.y).toBe(25);
			});
			test('center/top', () => {
				const rect = new Rectangle(0,0,10,10); // center = 5
				const rect2 = new Rectangle(10,10,20,20); // right = 40
				rect.alignToVertRect(rect2, AlignVert.TOP, AlignVert.CENTER);
				expect(rect.y).toBe(5);
			});
	
			test('top/bottom', () => {
				const rect = new Rectangle(0,0,10,10); // center = 5, 5
				const rect2 = new Rectangle(10,10,20,20); // center = 20, 20
				rect.alignToVertRect(rect2, AlignVert.BOTTOM, AlignVert.TOP);
				expect(rect.y).toBe(30);
			});
			test('bottom/center', () => {
				const rect = new Rectangle(0,0,10,10); // center = 5
				const rect2 = new Rectangle(10,10,20,20); // right = 40
				rect.alignToVertRect(rect2, AlignVert.CENTER, AlignVert.BOTTOM);
				expect(rect.y).toBe(10);
			});
			test('bottom/top', () => {
				const rect = new Rectangle(0,0,10,10); // center = 5
				const rect2 = new Rectangle(10,10,20,20); // right = 40
				rect.alignToVertRect(rect2, AlignVert.TOP, AlignVert.BOTTOM);
				expect(rect.y).toBe(0);
			});

			test('bottom/top negative', () => {
				const rect = new Rectangle(0,0,10,10); // center = 5
				const rect2 = new Rectangle(0,0,20,20); // right = 40
				rect.alignToVertRect(rect2, AlignVert.TOP, AlignVert.BOTTOM);
				expect(rect.y).toBe(-10);
			});
		});

		describe('both', () => {
			test('center/center', () => {
				const rect = new Rectangle(0,0,10,10); // center = 5, 5
				const rect2 = new Rectangle(10,20,20,20); // center = 20, 20
				rect.alignToRect(rect2, AlignHorz.CENTER, AlignVert.CENTER);
				expect(rect.x).toBe(15);
				expect(rect.y).toBe(25);
			});

			test('top/left', () => {
				const rect = new Rectangle(0,0,10,10); // center = 5, 5
				const rect2 = new Rectangle(10,20,20,20); // center = 20, 20
				rect.alignToRect(rect2, AlignHorz.LEFT, AlignVert.TOP);
				expect(rect.x).toBe(10);
				expect(rect.y).toBe(20);
			});
		});
	});
});

describe('scale', () => {

	test('scaleWidth', () => {
		const rect = new Rectangle(1,2,3,4);
		rect.scaleWidth(2);
		expect(rect.width).toBe(6);
	});

	test('scaleHeight', () => {
		const rect = new Rectangle(1,2,3,4);
		rect.scaleHeight(2);
		expect(rect.height).toBe(8);
	});

	test('scale', () => {
		const rect = new Rectangle(1,2,3,4);
		rect.scale(3);
		expect(rect.width).toBe(9);
		expect(rect.height).toBe(12);
	});

	test('scaleXY', () => {
		const rect = new Rectangle(1,2,3,4);
		rect.scaleXY(2, 3);
		expect(rect.width).toBe(6);
		expect(rect.height).toBe(12);
	});

	test('scaleVec2', () => {
		const rect = new Rectangle(1,2,3,4);
		rect.scaleVec2({x: 5, y: 10});
		expect(rect.width).toBe(15);
		expect(rect.height).toBe(40);
	});

	test('scaleFromCenterXY', () => {
		const rect = new Rectangle(1,2,3,4);
		rect.scaleFromCenterXY(2, 3);
		expect(rect.width).toBe(6);
		expect(rect.height).toBe(12);
		expect(rect.x).toBe(-0.5);
		expect(rect.y).toBe(-2);
	});

	describe('scaleToAspect', () => {
		test('up -> AspectRatioMode.KEEP', () => {
			const rect = new Rectangle(0, 0, 10, 10);
			const rect2 = new Rectangle(100, 100, 40, 50);
			rect.scaleToAspect(rect2, AspectRatioMode.KEEP);
			expect(rect.width).toBe(40);
			expect(rect.height).toBe(40);
			expect(rect.x).toBe(100);
			expect(rect.y).toBe(105);
		});

		test('down -> AspectRatioMode.KEEP', () => {
			const rect = new Rectangle(0, 0, 10, 10);
			const rect2 = new Rectangle(100, 100, 40, 50);
			rect2.scaleToAspect(rect, AspectRatioMode.KEEP);
			expect(rect2.width).toBe(8);
			expect(rect2.height).toBe(10);
			expect(rect2.x).toBe(1);
			expect(rect2.y).toBe(0);
		});

		test('up -> AspectRatioMode.KEEP_NO_ENLARGE', () => {
			const rect = new Rectangle(0, 0, 10, 10);
			const rect2 = new Rectangle(100, 100, 40, 50);
			rect.scaleToAspect(rect2, AspectRatioMode.KEEP_NO_ENLARGE);
			expect(rect.width).toBe(10);
			expect(rect.height).toBe(10);
			expect(rect.x).toBe(115);
			expect(rect.y).toBe(120);
		});

		test('down -> AspectRatioMode.KEEP_NO_ENLARGE', () => {
			const rect = new Rectangle(0, 0, 10, 10);
			const rect2 = new Rectangle(100, 100, 40, 50);
			rect2.scaleToAspect(rect, AspectRatioMode.KEEP_NO_ENLARGE);
			expect(rect2.width).toBe(8);
			expect(rect2.height).toBe(10);
			expect(rect2.x).toBe(1);
			expect(rect2.y).toBe(0);
		})
	});
});

