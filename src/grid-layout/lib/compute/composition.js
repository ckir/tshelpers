import { GridCompute } from './grid.js';
import { TrackCompute } from './track.js';
export class Composition {
    container;
    rowTrack;
    columnTrack;
    cells;
    constructor(container) {
        this.container = container;
        const grid = new GridCompute(this.container);
        const gridTemplateAreas = this.container.config.gridTemplateAreas;
        if (gridTemplateAreas && gridTemplateAreas.length) {
            grid.setAreas(gridTemplateAreas);
        }
        const nodes = this.container.children;
        grid.putNodes(nodes);
        this.cells = grid.cells;
        this.rowTrack = grid.rowTrack;
        this.columnTrack = grid.columnTrack;
    }
    parseCellSize() {
        this.cells.forEach((lines, rowIndex) => {
            lines.forEach((item, columnIndex) => {
                item.width = this.columnTrack[columnIndex].baseSize;
                item.height = this.rowTrack[rowIndex].baseSize;
                item.top = this.rowTrack[rowIndex].pos;
                item.left = this.columnTrack[columnIndex].pos;
            });
        });
    }
    parseNodeSize() {
        this.container.children.map((node) => {
            const tops = [];
            const lefts = [];
            const bottoms = [];
            const rights = [];
            node.cells.forEach(cell => {
                tops.push(cell.top);
                lefts.push(cell.left);
                rights.push(cell.left + cell.width);
                bottoms.push(cell.top + cell.height);
            });
            const boundingRect = { top: Math.min(...tops), left: Math.min(...lefts) };
            boundingRect.width = Math.max(...rights) - boundingRect.left;
            boundingRect.height = Math.max(...bottoms) - boundingRect.top;
            node.parsePosition(boundingRect);
        });
    }
    compose() {
        const rowInstance = new TrackCompute(this.rowTrack, this.cells, this.container, 'row');
        rowInstance.parse();
        const columnInstane = new TrackCompute(this.columnTrack, this.cells, this.container, 'column');
        columnInstane.parse();
        this.parseCellSize();
        this.parseNodeSize();
    }
}
