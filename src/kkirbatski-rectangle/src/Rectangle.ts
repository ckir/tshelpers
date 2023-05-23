/* eslint-disable no-dupe-class-members */

function isFloatEqual(a: number, b: number): boolean {
	return Math.abs(a - b) <= 0.001;
}

export enum AspectRatioMode {
	/// \brief Set the rectangle's width and height to match the target.
	IGNORE = 0,
	/// \brief Resizes the rectangle to completely fit within the target.
	KEEP = 1,
	/// \brief Resizes the rectangle to completely enclose the target.
	KEEP_BY_EXPANDING = 2,
	/// \breif Resizes the rectangle to completely fit within the target, but does not change enlarge the rectangle.
	KEEP_NO_ENLARGE = 3,
}

/// \brief Used to represent the available vertical rectangle alignment modes.
///
/// \sa ofRectangle
export enum AlignVert {
	/// \brief Do not perform any vertical alignment.
	IGNORE = 0x0000,
	/// \brief Use the upper edge of the rectangle to vertically anchor the alignment.
	TOP = 0x0010,
	/// \brief Use the bottom edge of the rectangle to vertically anchor the alignment.
	BOTTOM = 0x0020,
	/// \brief Use the center of the rectangle to vertically anchor the alignment.
	CENTER = 0x0040,
}

/// \brief Used to represent the available horizontal rectangle alignment modes.
///
/// \sa ofRectangle
export enum AlignHorz {
	/// \brief Do not perform any horizontal alignment.
	IGNORE = 0x0000,
	/// \brief Use the left edge of the rectangle to horizontally anchor the alignment.
	LEFT = 0x0001,
	/// \brief Use the right edge of the rectangle to horizontally anchor the alignment.
	RIGHT = 0x0002,
	/// \brief Use the center of the rectangle to horizontally anchor the alignment.
	CENTER = 0x0004,
}

/// \brief Used to represent the available rectangle scaling modes.
///
/// ofScaleMode can usually be interpreted as a concise combination of
/// an ::ofAspectRatioMode, an ::ofAlignVert and an ::ofAlignHorz.
export enum ScaleMode {
	/// \brief Center and scale the rectangle to fit inside the target.
	///
	/// This centers the subject rectangle within the target rectangle and
	/// resizes the subject rectangle to completely fit within the target
	/// rectangle.
	FIT = 0,

	/// \brief Move and scale the rectangle to completely enclose the target.
	///
	/// This centers the subject rectangle within the target rectangle and
	/// resizes the subject rectangle to completely encompass the target
	/// rectangle.
	FILL = 1,

	/// \brief Move the rectangle to be centered on the target.
	///
	/// This centers the subject rectangle within the target rectangle and
	/// does not modify the Subject's size or aspect ratio.
	CENTER = 2, // centers the subject

	/// \brief Match the target rectangle's position and dimensions.
	STRETCH_TO_FILL = 3,

	FIT_NO_ENLARGE = 4,
}

interface Vec2 {
	x: number;
	y: number;
}

export default class Rectangle {
	x: number;
	y: number;
	width: number;
	height: number;

	constructor(
		x: number = 0,
		y: number = 0,
		width: number = 0,
		height: number = 0,
	) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
	}

	set(x?: number, y?: number, width?: number, height?: number): this {
		if (x != null) {
			this.x = x;
		}
		if (y != null) {
			this.y = y;
		}
		if (width != null) {
			this.width = width;
		}
		if (height != null) {
			this.height = height;
		}

		return this;
	}

	setFromVec2(vec: Vec2, width?: number, height?: number): this {
		return this.set(vec.x, vec.y, width, height);
	}

	setFromRect(rect: Rectangle): this {
		return this.set(rect.x, rect.y, rect.width, rect.height);
	}

	setFromCorners(topLeft: Vec2, bottomRight: Vec2): this {
		let x0: number;
		let y0: number;
		let x1: number;
		let y1: number;

		x0 = Math.min(topLeft.x, bottomRight.x);
		x1 = Math.max(topLeft.x, bottomRight.x);
		y0 = Math.min(topLeft.y, bottomRight.y);
		y1 = Math.max(topLeft.y, bottomRight.y);

		const w = x1 - x0;
		const h = y1 - y0;

		return this.set(x0, y0, w, h);
	}

	get position(): Vec2 {
		return {
			x: this.x,
			y: this.y,
		};
	}

	set position(position: Vec2) {
		this.x = position.x;
		this.y = position.y;
	}

	get size(): Vec2 {
		return {
			x: this.width,
			y: this.height,
		};
	}

	set size(vec: Vec2) {
		this.width = vec.x;
		this.height = vec.y;
	}

	setFromCenter(x: number, y: number, w: number, h: number): this {
		return this.set(x - w * 0.5, y - h * 0.5, w, h);
	}

	setFromCenterVec2(vec: Vec2, w: number, h: number): this {
		return this.setFromCenter(vec.x, vec.y, w, h);
	}

	translate(dx: number, dy: number): this {
		return this.translateX(dx).translateY(dy);
	}

	translateVec2(vec: Vec2): this {
		return this.translate(vec.x, vec.y);
	}

	translateX(x: number): this {
		this.x += x;

		return this;
	}

	translateY(y: number): this {
		this.y += y;

		return this;
	}

	scale(scale: number): this {
		return this.scaleXY(scale, scale);
	}

	scaleXY(x: number, y: number): this {
		return this.scaleWidth(x).scaleHeight(y);
	}

	scaleVec2(vec: Vec2): this {
		return this.scaleXY(vec.x, vec.y);
	}

	scaleWidth(x: number): this {
		this.width *= x;

		return this;
	}

	scaleHeight(y: number): this {
		this.height *= y;

		return this;
	}

	scaleFromCenter(scale: number): this {
		return this.scaleFromCenterXY(scale, scale);
	}

	scaleFromCenterXY(x: number, y: number): this {
		if (isFloatEqual(x, 1.0) && isFloatEqual(y, 1.0)) {
			// Nothing to do
			return this;
		}

		const newWidth = this.width * x;
		const newHeight = this.height * y;

		const center = this.center;

		this.x = center.x - newWidth / 2;
		this.y = center.y - newHeight / 2;

		this.width = newWidth;
		this.height = newHeight;

		return this;
	}

	scaleFromCenterVec2(vec: Vec2): this {
		return this.scaleFromCenterXY(vec.x, vec.y);
	}

	public scaleToAspect(
		targetRect: Rectangle,
		subjectAspectRatioMode: AspectRatioMode,
	): this;

	public scaleToAspect(
		targetRect: Rectangle,
		subjectAspectRatioMode: AspectRatioMode,
		sharedHorzAnchor: AlignHorz,
	): this;

	public scaleToAspect(
		targetRect: Rectangle,
		subjectAspectRatioMode: AspectRatioMode,
		sharedHorzAnchor: AlignHorz,
		sharedVertAnchor: AlignVert,
	): this;

	public scaleToAspect(
		targetRect: Rectangle,
		aspectRatioMode: AspectRatioMode,
		modelHorzAnchor: AlignHorz,
		modelVertAnchor: AlignVert,
		thisHorzAnchor: AlignHorz,
		thisVertAnchor: AlignVert,
	): this;

	scaleToAspect(
		targetRect: Rectangle,
		aspectRatioMode: AspectRatioMode,
		...args:
			| []
			| [AlignHorz]
			| [AlignHorz, AlignVert]
			| [AlignHorz, AlignVert, AlignHorz, AlignVert]
	): this {
		if (args.length === 0) {
			return this.scaleToAspect(
				targetRect,
				aspectRatioMode,
				AlignHorz.CENTER,
			);
		} else if (args.length === 1) {
			return this.scaleToAspect(
				targetRect,
				aspectRatioMode,
				args[0],
				AlignVert.CENTER,
			);
		} else if (args.length === 2) {
			return this.scaleToAspect(
				targetRect,
				aspectRatioMode,
				args[0],
				args[1],
				args[0],
				args[1],
			);
		}

		const [
			modelHorzAnchor,
			modelVertAnchor,
			thisHorzAnchor,
			thisVertAnchor,
		] = args;

		let tw = targetRect.width; // target width
		let th = targetRect.height; // target height
		let sw = this.width; // subject width
		let sh = this.height; // subject height

		if (
			aspectRatioMode === AspectRatioMode.KEEP_BY_EXPANDING ||
			aspectRatioMode === AspectRatioMode.KEEP ||
			aspectRatioMode === AspectRatioMode.KEEP_NO_ENLARGE
		) {
			if(aspectRatioMode !== AspectRatioMode.KEEP_NO_ENLARGE || (sw > tw || sh > th)){
				if (Math.abs(sw) >= Number.EPSILON || Math.abs(sh) >= Number.EPSILON) {
					let wRatio = Math.abs(tw) / Math.abs(sw);
					let hRatio = Math.abs(th) / Math.abs(sh);
					if (aspectRatioMode === AspectRatioMode.KEEP_BY_EXPANDING) {
						this.scale(Math.max(wRatio, hRatio));
					} else if (aspectRatioMode === AspectRatioMode.KEEP || AspectRatioMode.KEEP_NO_ENLARGE) {
						this.scale(Math.min(wRatio, hRatio));
					}
				}
			}
		} else if (aspectRatioMode === AspectRatioMode.IGNORE) {
			this.width = tw;
			this.height = th;
		} else {
			this.width = tw;
			this.height = th;
		}

		// now align if anchors are not ignored.
		this.alignToRect(
			targetRect,
			modelHorzAnchor,
			modelVertAnchor,
			thisHorzAnchor,
			thisVertAnchor,
		);

		return this;
	}

	scaleTo(targetRect: Rectangle, scaleMode: ScaleMode = ScaleMode.FIT): this {
		if (scaleMode === ScaleMode.FIT) {
			return this.scaleToAspect(
				targetRect,
				AspectRatioMode.KEEP,
				AlignHorz.CENTER,
				AlignVert.CENTER,
			);
		} else if (scaleMode === ScaleMode.FIT_NO_ENLARGE) {
			return this.scaleToAspect(
				targetRect,
				AspectRatioMode.KEEP_NO_ENLARGE,
				AlignHorz.CENTER,
				AlignVert.CENTER,
			);
		}
		else if (scaleMode === ScaleMode.FILL) {
			return this.scaleToAspect(
				targetRect,
				AspectRatioMode.KEEP_BY_EXPANDING,
				AlignHorz.CENTER,
				AlignVert.CENTER,
			);
		} else if (scaleMode === ScaleMode.CENTER) {
			return this.alignToRect(targetRect, AlignHorz.CENTER, AlignVert.CENTER);
		} else if (scaleMode === ScaleMode.STRETCH_TO_FILL) {
			return this.scaleToAspect(
				targetRect,
				AspectRatioMode.IGNORE,
				AlignHorz.CENTER,
				AlignVert.CENTER,
			);
		} else {
			return this.scaleToAspect(targetRect, AspectRatioMode.KEEP);
		}
	}

	alignToHorz(
		targetX: number,
		thisHorzAnchor: AlignHorz = AlignHorz.CENTER,
	): this {
		if (thisHorzAnchor !== AlignHorz.IGNORE) {
			this.translateX(targetX - this.getHorzAnchor(thisHorzAnchor));
		}

		return this;
	}

	public alignToHorzRect(targetRect: Rectangle): this;
	public alignToHorzRect(
		targetRect: Rectangle,
		sharedAnchor: AlignHorz,
	): this;
	public alignToHorzRect(
		targetRect: Rectangle,
		targetHorzAnchor: AlignHorz,
		thisHorzAnchor: AlignHorz,
	): this;

	alignToHorzRect(
		targetRect: Rectangle,
		...args: [] | [AlignHorz] | [AlignHorz, AlignHorz]
	): this {
		if (args.length === 0) {
			return this.alignToHorzRect(targetRect, AlignHorz.CENTER);
		} else if (args.length === 1) {
			return this.alignToHorzRect(targetRect, args[0], args[0]);
		}

		const [targetHorzAnchor, thisHorzAnchor] = args;

		if (
			targetHorzAnchor !== AlignHorz.IGNORE &&
			thisHorzAnchor !== AlignHorz.IGNORE
		) {
			this.alignToHorz(
				targetRect.getHorzAnchor(targetHorzAnchor),
				thisHorzAnchor,
			);
		}

		return this;
	}

	//----------------------------------------------------------
	alignToVert(
		targetY: number,
		thisVertAnchor: AlignVert = AlignVert.CENTER,
	): this {
		if (thisVertAnchor !== AlignVert.IGNORE) {
			this.translateY(targetY - this.getVertAnchor(thisVertAnchor));
		}

		return this;
	}

	public alignToVertRect(targetRect: Rectangle): this;
	public alignToVertRect(
		targetRect: Rectangle,
		sharedAnchor: AlignVert,
	): this;
	public alignToVertRect(
		targetRect: Rectangle,
		targetVertAnchor: AlignVert,
		thisVertAnchor: AlignVert,
	): this;

	//----------------------------------------------------------
	alignToVertRect(
		targetRect: Rectangle,
		...args: [] | [AlignVert] | [AlignVert, AlignVert]
	): this {
		if (args.length === 0) {
			return this.alignToVertRect(targetRect, AlignVert.CENTER);
		} else if (args.length === 1) {
			return this.alignToVertRect(targetRect, args[0], args[0]);
		}

		const [targetVertAnchor, thisVertAnchor] = args;
		if (
			targetVertAnchor !== AlignVert.IGNORE &&
			thisVertAnchor !== AlignVert.IGNORE
		) {
			this.alignToVert(
				targetRect.getVertAnchor(targetVertAnchor),
				thisVertAnchor,
			);
		}

		return this;
	}

	alignToVec2(
		targetPoint: Vec2,
		thisHorzAnchor: AlignHorz,
		thisVertAnchor: AlignVert,
	): this {
		this.alignToHorz(targetPoint.x, thisHorzAnchor);
		this.alignToVert(targetPoint.y, thisVertAnchor);

		return this;
	}

	//----------------------------------------------------------

	//----------------------------------------------------------

	public alignToRect(targetRect: Rectangle): this;
	public alignToRect(
		targetRect: Rectangle,
		sharedHorzAnchor: AlignHorz,
	): this;
	public alignToRect(
		targetRect: Rectangle,
		sharedHorzAnchor: AlignHorz,
		sharedVertAnchor: AlignVert,
	): this;
	public alignToRect(
		targetRect: Rectangle,
		targetHorzAnchor: AlignHorz,
		targetVertAnchor: AlignVert,
		thisHorzAnchor: AlignHorz,
		thisVertAnchor: AlignVert,
	): this;

	alignToRect(
		targetRect: Rectangle,
		...args:
			| []
			| [AlignHorz]
			| [AlignHorz, AlignVert]
			| [AlignHorz, AlignVert, AlignHorz, AlignVert]
	): this {
		if (args.length === 0) {
			return this.alignToRect(targetRect, AlignHorz.CENTER);
		} else if (args.length === 1) {
			return this.alignToRect(targetRect, args[0], AlignVert.CENTER);
		} else if (args.length === 2) {
			return this.alignToRect(targetRect, args[0], args[1], args[0], args[1]);
		}
		const [
			targetHorzAnchor,
			targetVertAnchor,
			thisHorzAnchor,
			thisVertAnchor,
		] = args;
		this.alignToHorzRect(targetRect, targetHorzAnchor, thisHorzAnchor);
		this.alignToVertRect(targetRect, targetVertAnchor, thisVertAnchor);
		return this;
	}

	insideXY(x: number, y: number): boolean {
		return x > this.minX && y > this.minY && x < this.maxX && y < this.maxX;
	}

	insideVec2(vec: Vec2): boolean {
		return this.insideXY(vec.x, vec.y);
	}

	insideRect(rect: Rectangle): boolean {
		return (
			this.insideXY(rect.minX, rect.minY) &&
			this.insideXY(rect.maxX, rect.maxY)
		);
	}

	insideLine(vec1: Vec2, vec2: Vec2): boolean {
		return this.insideVec2(vec1) && this.insideVec2(vec2);
	}

	growToIncludeXY(x: number, y: number): this {
		const x0 = Math.min(this.minX, x);
		const x1 = Math.max(this.maxX, x);
		const y0 = Math.min(this.minY, y);
		const y1 = Math.max(this.maxY, y);
		const w = x1 - x0;
		const h = y1 - y0;
		this.set(x0, y0, w, h);

		return this;
	}

	growToIncludeVec2(vec: Vec2): this {
		return this.growToIncludeXY(vec.x, vec.y);
	}

	growToIncludeRect(rect: Rectangle): this {
		const x0 = Math.min(this.minX, rect.minX);
		const x1 = Math.max(this.maxX, rect.maxX);
		const y0 = Math.min(this.minY, rect.minY);
		const y1 = Math.max(this.maxY, rect.maxY);
		const w = x1 - x0;
		const h = y1 - y0;
		this.set(x0, y0, w, h);

		return this;
	}

	growToIncludeLine(vec1: Vec2, vec2: Vec2): this {
		this.growToIncludeVec2(vec1);
		this.growToIncludeVec2(vec2);

		return this;
	}

	getIntersectionRect(rect: Rectangle): Rectangle {
		const x0 = Math.max(this.minX, rect.minX);
		const x1 = Math.min(this.maxX, rect.maxX);

		const w = x1 - x0;
		if (w < 0) {
			return new Rectangle();
		}

		const y0 = Math.max(this.minY, rect.minY);
		const y1 = Math.min(this.maxY, rect.maxY);

		const h = y1 - y0;
		if (h < 0) {
			return new Rectangle();
		}

		return new Rectangle(x0, y0, w, h);
	}

	getUnionRect(rect: Rectangle) {
		const united = new Rectangle(this.x, this.y, this.width, this.height);
		united.growToIncludeRect(rect);

		return united;
	}

	standardize(): this {
		if (this.width < 0) {
			this.x += this.width;
			this.width *= -1;
		}
		if (this.height < 0) {
			this.y += this.height;
			this.height *= -1;
		}

		return this;
	}

	get isStandardized(): boolean {
		return this.width >= 0 && this.height >= 0;
	}

	get area(): number {
		return Math.abs(this.width) * Math.abs(this.height);
	}

	get perimeter(): number {
		return 2 * Math.abs(this.width) + 2 * Math.abs(this.height);
	}

	get aspectRatio(): number {
		return Math.abs(this.width) / Math.abs(this.height);
	}

	get isEmpty(): boolean {
		return isFloatEqual(this.width, 0.0) && isFloatEqual(this.height, 0.0);
	}

	get min(): Vec2 {
		return {
			x: this.minX,
			y: this.minY,
		};
	}

	get max(): Vec2 {
		return {
			x: this.maxX,
			y: this.maxY,
		};
	}

	get minX(): number {
		return Math.min(this.x, this.x + this.width);
	}

	get maxX(): number {
		return Math.max(this.x, this.x + this.width);
	}

	get minY(): number {
		return Math.min(this.y, this.y + this.height);
	}

	get maxY(): number {
		return Math.max(this.y, this.y + this.height);
	}

	get left(): number {
		return this.minX;
	}

	get right(): number {
		return this.maxX;
	}

	get top(): number {
		return this.minY;
	}

	get bottom(): number {
		return this.maxY;
	}

	get topLeft(): Vec2 {
		return this.min;
	}

	get topRight(): Vec2 {
		return {
			x: this.right,
			y: this.top,
		};
	}

	get bottomLeft(): Vec2 {
		return {
			x: this.left,
			y: this.bottom,
		};
	}

	get bottomRight(): Vec2 {
		return this.max;
	}

	get center(): Vec2 {
		return {
			x: this.x + this.width * 0.5,
			y: this.y + this.height * 0.5,
		};
	}

	getHorzAnchor(anchor: AlignHorz): number {
		if (anchor === AlignHorz.LEFT) {
			return this.left;
		} else if (anchor === AlignHorz.RIGHT) {
			return this.right;
		} else if (anchor === AlignHorz.CENTER) {
			return this.center.x;
		} else {
			return 0;
		}
	}

	getVertAnchor(anchor: AlignVert): number {
		if (anchor === AlignVert.TOP) {
			return this.top;
		} else if (anchor === AlignVert.BOTTOM) {
			return this.bottom;
		} else if (anchor === AlignVert.CENTER) {
			return this.center.y;
		} else {
			return 0;
		}
	}

	notEquals(rect: Rectangle): boolean {
		return (
			this.x !== rect.x ||
			this.y !== rect.y ||
			this.width !== rect.width ||
			this.height !== rect.height
		);
	}

	equals(rect: Rectangle): boolean {
		return (
			isFloatEqual(this.x, rect.x) &&
			isFloatEqual(this.y, rect.y) &&
			isFloatEqual(this.width, rect.width) &&
			isFloatEqual(this.height, rect.height)
		);
	}

	addVec2(vec: Vec2): this {
		this.x += vec.x;
		this.y += vec.y;

		return this;
	}

	subVec2(vec: Vec2): this {
		this.x -= vec.x;
		this.y -= vec.y;

		return this;
	}
}