import { parseNumberValue, parseMarginAuto, parseMinMaxValue, parseCombineValue } from './util/util.js';
let id = 1;
export class Node {
    id = 1;
    parent;
    config;
    boundingRect = {};
    cells = [];
    placement = {
        row: { start: -1, end: -1, size: 1 },
        column: { start: -1, end: -1, size: 1 }
    };
    constructor(config = {}) {
        this.id = id++;
        this.config = Object.assign({}, config);
    }
    parse() {
        const keys = Object.keys(this.config);
        keys.forEach(item => {
            if (item.startsWith('border') || item.startsWith('padding') || item.startsWith('margin')) {
                this.parseCombineProperty(item);
            }
        });
        ['gridRowStart', 'gridRowEnd', 'gridColumnStart', 'gridColumnEnd'].forEach(item => {
            this.parseGridLine(item);
        });
        this.parseSize();
        if (!this.config.alignSelf) {
            this.config.alignSelf = 'auto';
        }
        if (!this.config.justifySelf) {
            this.config.justifySelf = 'auto';
        }
    }
    parseGridLine(property) {
        const value = this.config[property];
        if (!value || value === 'auto') {
            this.config[property] = {};
        }
        else if (typeof value === 'number') {
            this.config[property] = { integer: value };
        }
        else {
            const arr = value.split(/\s+/g).filter(item => item);
            const desc = {};
            arr.forEach(item => {
                if (item === 'span') {
                    if (desc.span) {
                        throw new Error(`${property}: ${value} is not valid`);
                    }
                    desc.span = true;
                }
                else if (/^\-?\d+$/.test(item)) {
                    desc.integer = parseInt(item, 10);
                }
                else {
                    desc.customIdent = item;
                }
            });
            this.config[property] = desc;
        }
    }
    parseCombineProperty(property) {
        const pWidth = this.parent.config.width;
        if (property === 'border' || property === 'padding' || property === 'margin') {
            const values = parseCombineValue(property).map(item => parseNumberValue(item, pWidth));
            const props = [`${property}Top`, `${property}Right`, `${property}Bottom`, `${property}Left`];
            props.forEach((item, index) => {
                this.config[item] = values[index];
            });
        }
        else {
            this.config[property] = parseNumberValue(this.config[property], pWidth);
        }
    }
    parseSize() {
        const pWidth = this.parent.config.width;
        this.config.width = parseNumberValue(this.config.width, pWidth);
        this.config.minWidth = parseNumberValue(this.config.minWidth, pWidth);
        this.config.maxWidth = parseNumberValue(this.config.maxWidth, pWidth);
        if (this.config.minWidth > this.config.maxWidth) {
            this.config.maxWidth = 0;
        }
        const pHeight = this.parent.config.height;
        this.config.height = parseNumberValue(this.config.height, pHeight);
        this.config.minHeight = parseNumberValue(this.config.minHeight, pHeight);
        this.config.maxHeight = parseNumberValue(this.config.maxHeight, pHeight);
        if (this.config.minHeight > this.config.maxHeight) {
            this.config.maxHeight = 0;
        }
        this.config.minContentWidth = parseNumberValue(this.config.minContentWidth, pWidth);
        this.config.maxContentWidth = parseNumberValue(this.config.maxContentWidth, pWidth);
        this.config.minContentHeight = parseNumberValue(this.config.minContentHeight, pHeight);
        this.config.maxContentHeight = parseNumberValue(this.config.maxContentHeight, pHeight);
        this.boundingRect.width = this.getComputedWidth(this.config.minContentWidth);
        this.boundingRect.height = this.getComputedHeight(this.config.minContentHeight);
    }
    getComputedWidth(width = 0) {
        width = this.config.width || width || 0;
        const minWidth = this.config.minWidth;
        let maxWidth = this.config.maxWidth;
        return parseMinMaxValue(width, minWidth, maxWidth);
    }
    getLayoutWidth(width = 0) {
        width = this.getComputedWidth(width);
        const marginLeft = parseMarginAuto(this.config.marginLeft);
        const marginRight = parseMarginAuto(this.config.marginRight);
        width += marginLeft + marginRight;
        if (this.config.boxSizing !== 'border-box') {
            const props = ['borderLeft', 'borderRight', 'paddingLeft', 'paddingRight'];
            props.forEach((item) => {
                width += this.config[item] || 0;
            });
        }
        return width;
    }
    getComputedHeight(height = 0) {
        height = this.config.height || height || 0;
        const minHeight = this.config.minHeight;
        let maxHeight = this.config.maxHeight;
        return parseMinMaxValue(height, minHeight, maxHeight);
    }
    getLayoutHeight(height = 0) {
        height = this.getComputedHeight(height);
        const marginTop = parseMarginAuto(this.config.marginTop);
        const marginBottom = parseMarginAuto(this.config.marginBottom);
        height += marginTop + marginBottom;
        if (this.config.boxSizing !== 'border-box') {
            const props = ['borderTop', 'borderBottom', 'paddingTop', 'paddingBottom'];
            props.forEach((item) => {
                height += this.config[item] || 0;
            });
        }
        return height;
    }
    get minContentWidth() {
        return this.getLayoutWidth(this.config.minContentWidth);
    }
    get maxContentWidth() {
        return this.getLayoutWidth(this.config.maxContentWidth);
    }
    get minContentHeight() {
        return this.getLayoutHeight(this.config.minContentHeight);
    }
    get maxContentHeight() {
        return this.getLayoutHeight(this.config.maxContentHeight);
    }
    parseAutoMargin(type, boundingRect) {
        const isRow = type === 'row';
        const marginStart = isRow ? this.config.marginTop : this.config.marginLeft;
        const marginEnd = isRow ? this.config.marginBottom : this.config.marginRight;
        const startAuto = marginStart === 'auto';
        const endAuto = marginEnd === 'auto';
        if (startAuto || endAuto) {
            const cellSize = isRow ? boundingRect.height : boundingRect.width;
            const nodeSize = isRow ? this.getLayoutHeight() : this.getLayoutWidth();
            const size = Math.max(0, cellSize - nodeSize);
            const prop = isRow ? 'top' : 'left';
            if (startAuto && endAuto) {
                this.boundingRect[prop] = boundingRect[prop] + size / 2;
            }
            else if (startAuto) {
                this.boundingRect[prop] = boundingRect[prop] + size;
            }
            else {
                this.boundingRect[prop] = boundingRect[prop] + parseMarginAuto(marginStart);
            }
            return true;
        }
        return false;
    }
    parseAlign(align, type, boundingRect) {
        const isRow = type === 'row';
        const prop = isRow ? 'top' : 'left';
        const sizeProp = isRow ? 'height' : 'width';
        const cellSize = isRow ? boundingRect.height : boundingRect.width;
        const nodeSize = isRow ? this.getLayoutHeight() : this.getLayoutWidth();
        const size = Math.max(0, cellSize - nodeSize);
        const marginStart = parseMarginAuto(isRow ? this.config.marginTop : this.config.marginLeft);
        switch (align) {
            case 'start':
                this.boundingRect[prop] = boundingRect[prop] + marginStart;
                break;
            case 'center':
                this.boundingRect[prop] = boundingRect[prop] + size / 2 + marginStart;
                break;
            case 'end':
                this.boundingRect[prop] = boundingRect[prop] + size + marginStart;
                break;
            case 'stretch':
                if (!this.config[sizeProp]) {
                    const min = (isRow ? this.config.minHeight : this.config.minWidth);
                    const max = (isRow ? this.config.maxHeight : this.config.maxWidth);
                    const marginEnd = parseMarginAuto(isRow ? this.config.marginBottom : this.config.marginRight);
                    const value = parseMinMaxValue(boundingRect[sizeProp] - marginStart - marginEnd, min, max);
                    if (value > this.boundingRect[sizeProp]) {
                        this.boundingRect[sizeProp] = value;
                    }
                }
                this.boundingRect[prop] = boundingRect[prop] + marginStart;
                break;
        }
    }
    parsePosition(boundingRect) {
        if (!this.parseAutoMargin('row', boundingRect)) {
            let alignSelf = this.config.alignSelf;
            if (alignSelf === 'auto') {
                alignSelf = this.parent.config.alignItems;
            }
            this.parseAlign(alignSelf, 'row', boundingRect);
        }
        if (!this.parseAutoMargin('column', boundingRect)) {
            let justifySelf = this.config.justifySelf;
            if (justifySelf === 'auto') {
                justifySelf = this.parent.config.justifyItems;
            }
            this.parseAlign(justifySelf, 'column', boundingRect);
        }
    }
    getComputedLayout() {
        return this.boundingRect;
    }
}
