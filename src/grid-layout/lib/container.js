import { TrackParser } from './parser/track.js';
import { RepeatTrackCompute } from './compute/repeatTrack.js';
import { AreaParser } from './parser/area.js';
import { Composition } from './compute/composition.js';
export class Container {
    children = [];
    config;
    constructor(config) {
        this.config = Object.assign({}, config);
    }
    appendChild(node) {
        node.parent = this;
        this.children.push(node);
        return this;
    }
    parseOrder(items) {
        items.sort((a, b) => {
            const ar = a.config.order | 0;
            const br = b.config.order | 0;
            if (a.config.order && b.config.order)
                return ar > br ? 1 : -1;
            if (a.config.order)
                return ar > 0 ? 1 : -1;
            if (b.config.order)
                return br > 0 ? -1 : 1;
            return a.id > b.id ? 1 : -1;
        });
        return items;
    }
    parse() {
        this.parseOrder(this.children);
        ['gridTemplateRows', 'gridTemplateColumns', 'gridAutoRows', 'gridAutoColumns'].forEach(item => {
            const parser = new TrackParser(this.config[item]);
            parser.parse();
            const type = item.includes('Rows') ? 'row' : 'column';
            const compute = new RepeatTrackCompute(parser.trackList, this, type);
            compute.parse();
            this.config[item] = compute.trackList;
        });
        if (this.config.gridAutoFlow) {
            const gridAutoFlow = this.config.gridAutoFlow;
            const autoFlow = {};
            if (gridAutoFlow.indexOf('column') > -1) {
                autoFlow.column = true;
            }
            else {
                autoFlow.row = true;
            }
            if (gridAutoFlow.indexOf('dense') > -1) {
                autoFlow.dense = true;
            }
            this.config.gridAutoFlow = autoFlow;
        }
        if (this.config.gridTemplateAreas && typeof this.config.gridTemplateAreas === 'string') {
            const instance = new AreaParser(this.config.gridTemplateAreas);
            const areas = instance.parse();
            this.config.gridTemplateAreas = areas;
        }
        this.config.gridRowGap = parseFloat(this.config.gridRowGap) || 0;
        if (this.config.gridRowGap < 0) {
            throw new Error('gridRowGap: negative values are invalid');
        }
        this.config.gridColumnGap = parseFloat(this.config.gridColumnGap) || 0;
        if (this.config.gridColumnGap < 0) {
            throw new Error('gridColumnGap: negative values are invalid');
        }
        ['justifyContent', 'alignContent', 'alignItems', 'justifyItems'].forEach(item => {
            if (!this.config[item]) {
                this.config[item] = 'stretch';
            }
        });
    }
    calculateLayout() {
        this.parse();
        this.children.forEach(item => {
            item.parse();
        });
        const instance = new Composition(this);
        instance.compose();
    }
    getAllComputedLayout() {
        this.children.sort((a, b) => {
            return a.id > b.id ? 1 : -1;
        });
        const layout = { top: 0, left: 0, width: this.config.width, height: this.config.height };
        layout.children = this.children.map(item => {
            return item.getComputedLayout();
        });
        return layout;
    }
}
