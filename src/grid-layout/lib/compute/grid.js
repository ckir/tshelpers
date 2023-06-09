import { deepmerge } from '../util/util.js';
export class GridCompute {
    cells = [];
    areaNames = {};
    container;
    rowTrack;
    initRowTrackSize;
    columnTrack;
    initColumnTrackSize;
    autoRowTrack;
    autoRowIndex = 0;
    autoColumnTrack;
    autoColumnIndex = 0;
    autoFlow;
    constructor(container) {
        this.container = container;
        this.rowTrack = container.config.gridTemplateRows;
        this.initRowTrackSize = this.rowTrack.length;
        this.columnTrack = container.config.gridTemplateColumns;
        this.initColumnTrackSize = this.columnTrack.length;
        this.autoRowTrack = container.config.gridAutoRows;
        if (!this.autoRowTrack.length) {
            this.autoRowTrack[0] = this.defaultAutoTrack;
        }
        if (!this.rowTrack.length) {
            this.rowTrack[0] = deepmerge(this.autoRowTrack[0]);
        }
        this.autoColumnTrack = container.config.gridAutoColumns;
        if (!this.autoColumnTrack.length) {
            this.autoColumnTrack[0] = this.defaultAutoTrack;
        }
        if (!this.columnTrack.length) {
            this.columnTrack[0] = deepmerge(this.autoColumnTrack[0]);
        }
        this.autoFlow = this.container.config.gridAutoFlow || {};
    }
    get defaultAutoTrack() {
        return {
            type: 'auto',
            baseSize: 0,
            growthLimit: Infinity,
            lineNamesStart: [],
            lineNamesEnd: []
        };
    }
    get rowSize() {
        return this.rowTrack.length;
    }
    get columnSize() {
        return this.columnTrack.length;
    }
    getInitCell(row, column) {
        return {
            row: row || 0,
            column: column || 0,
            node: []
        };
    }
    putNodeInCell(row, column, node) {
        if (!this.cells[row]) {
            this.cells[row] = [];
            this.flexTrackSize('row', row + 1);
        }
        this.flexTrackSize('column', column + 1);
        if (!this.cells[row][column]) {
            this.cells[row][column] = this.getInitCell(row, column);
        }
        this.cells[row][column].node.push(node);
        node.cells.push(this.cells[row][column]);
    }
    flexTrackSize(type, size) {
        const isRow = type === 'row';
        const track = isRow ? this.rowTrack : this.columnTrack;
        if (track.length < size) {
            const autoTrack = isRow ? this.autoRowTrack : this.autoColumnTrack;
            const length = autoTrack.length;
            for (let i = track.length; i < size; i++) {
                if (isRow) {
                    track[i] = deepmerge(autoTrack[this.autoRowIndex++ % length]);
                }
                else {
                    track[i] = deepmerge(autoTrack[this.autoColumnIndex++ % length]);
                }
            }
        }
    }
    setAreas(areas) {
        this.flexTrackSize('row', areas.length);
        this.flexTrackSize('column', areas[0].length);
        if (areas.length > this.initRowTrackSize) {
            this.initRowTrackSize = areas.length;
        }
        if (areas[0].length > this.initColumnTrackSize) {
            this.initColumnTrackSize = areas[0].length;
        }
        areas.forEach((line, row) => {
            line.forEach((name, column) => {
                if (!name)
                    return;
                if (!this.areaNames[name]) {
                    this.areaNames[name] = [];
                }
                this.areaNames[name].push({ row, column });
                const startName = `${name}-start`;
                const endName = `${name}-end`;
                if (!row) {
                    this.rowTrack[row].lineNamesStart.push(startName);
                }
                else if (areas[row - 1][column] !== name) {
                    this.rowTrack[row].lineNamesStart.push(startName);
                    this.rowTrack[row - 1].lineNamesEnd.push(startName);
                }
                if (row === areas.length - 1) {
                    this.rowTrack[row].lineNamesEnd.push(endName);
                }
                else if (areas[row + 1][column] !== name) {
                    this.rowTrack[row].lineNamesEnd.push(endName);
                    this.rowTrack[row + 1].lineNamesStart.push(endName);
                }
                if (!column) {
                    this.columnTrack[column].lineNamesStart.push(startName);
                }
                else if (areas[row][column - 1] !== name) {
                    this.columnTrack[column].lineNamesStart.push(startName);
                    this.columnTrack[column - 1].lineNamesEnd.push(startName);
                }
                if (column === areas[row].length - 1) {
                    this.columnTrack[column].lineNamesEnd.push(endName);
                }
                else if (areas[row][column + 1] !== name) {
                    this.columnTrack[column].lineNamesEnd.push(endName);
                    this.columnTrack[column + 1].lineNamesStart.push(endName);
                }
            });
        });
    }
    putNodes(nodes) {
        const autoNodes = [];
        const givedNodes = [];
        nodes.forEach(node => {
            const area = node.config.gridArea;
            if (area) {
                if (this.areaNames[area]) {
                    this.areaNames[area].forEach(pos => {
                        this.putNodeInCell(pos.row, pos.column, node);
                    });
                }
                else {
                    this.putNodeInCell(this.initRowTrackSize + 1, this.initColumnTrackSize + 1, node);
                }
                return;
            }
            const { gridRowStart, gridRowEnd, gridColumnStart, gridColumnEnd } = node.config;
            const rowPlacement = this.parseGridPlacement(this.rowTrack, gridRowStart, gridRowEnd, this.initRowTrackSize);
            const columnPlacement = this.parseGridPlacement(this.columnTrack, gridColumnStart, gridColumnEnd, this.initColumnTrackSize);
            node.placement = { row: rowPlacement, column: columnPlacement };
            if (rowPlacement.start > -1 && columnPlacement.start > -1) {
                for (let i = rowPlacement.start; i < rowPlacement.end; i++) {
                    for (let j = columnPlacement.start; j < columnPlacement.end; j++) {
                        this.putNodeInCell(i, j, node);
                    }
                }
                return;
            }
            if (rowPlacement.start > -1) {
                this.flexTrackSize('row', rowPlacement.end);
                if (!this.autoFlow.column) {
                    givedNodes.push(node);
                    return;
                }
            }
            if (columnPlacement.start > -1) {
                this.flexTrackSize('column', columnPlacement.end);
                if (this.autoFlow.column) {
                    givedNodes.push(node);
                    return;
                }
            }
            autoNodes.push(node);
        });
        this.putGivedNodes(givedNodes);
        this.putAutoNodes(autoNodes);
    }
    putGivedNodes(nodes) {
        let index = 0;
        nodes.forEach(node => {
            const isRow = node.placement.row.start > -1;
            const placement = isRow ? node.placement.row : node.placement.column;
            let i = index;
            while (true) {
                let empty = true;
                for (let j = placement.start; j < placement.end; j++) {
                    const rowIndex = isRow ? j : i;
                    const columnIndex = isRow ? i : j;
                    if (this.cells[rowIndex] && this.cells[rowIndex][columnIndex] && this.cells[rowIndex][columnIndex].node.length) {
                        empty = false;
                        break;
                    }
                }
                if (empty) {
                    for (let j = placement.start; j < placement.end; j++) {
                        const rowIndex = isRow ? j : i;
                        const columnIndex = isRow ? i : j;
                        this.putNodeInCell(rowIndex, columnIndex, node);
                    }
                    break;
                }
                i++;
            }
            this.flexTrackSize(isRow ? 'row' : 'column', i);
            index = this.autoFlow.dense ? 0 : i;
        });
    }
    tryToSetNode(node, rowIndex, columnIndex) {
        const { row, column } = node.placement;
        if (row.start > -1 && row.start !== rowIndex)
            return false;
        if (column.start > -1 && column.start !== columnIndex)
            return false;
        const rowEnd = row.end === -1 ? rowIndex + row.size : row.end;
        const columnEnd = column.end === -1 ? columnIndex + column.size : column.end;
        for (let i = rowIndex; i < rowEnd; i++) {
            for (let j = columnIndex; j < columnEnd; j++) {
                if (this.cells[i] && this.cells[i][j] && this.cells[i][j].node.length) {
                    return false;
                }
            }
        }
        for (let i = rowIndex; i < rowEnd; i++) {
            for (let j = columnIndex; j < columnEnd; j++) {
                this.putNodeInCell(i, j, node);
            }
        }
        return true;
    }
    putAutoNodes(nodes) {
        let rowIndex = 0;
        let columnIndex = 0;
        nodes.forEach(node => {
            const isColumnFlow = !!this.autoFlow.column;
            if (!isColumnFlow) {
                let i = rowIndex;
                const columnSize = this.columnSize;
                while (true) {
                    let flag = false;
                    for (let j = columnIndex; j < columnSize; j++) {
                        if (this.tryToSetNode(node, i, j)) {
                            columnIndex = j;
                            flag = true;
                            break;
                        }
                    }
                    if (!flag) {
                        columnIndex = 0;
                    }
                    else {
                        rowIndex = i;
                        break;
                    }
                    i++;
                }
                this.flexTrackSize('row', i + 1);
            }
            else {
                let i = columnIndex;
                const rowSize = this.rowSize;
                while (true) {
                    let flag = false;
                    for (let j = rowIndex; j < rowSize; j++) {
                        if (this.tryToSetNode(node, j, i)) {
                            rowIndex = j;
                            flag = true;
                            break;
                        }
                    }
                    if (!flag) {
                        rowIndex = 0;
                    }
                    else {
                        columnIndex = i;
                        break;
                    }
                    i++;
                }
                this.flexTrackSize('column', i + 1);
            }
            if (this.autoFlow.dense) {
                rowIndex = columnIndex = 0;
            }
        });
    }
    findPositionByCustomIdent(track, gridLine, type) {
        let index = -1;
        let num = 0;
        let { customIdent, integer = 1 } = gridLine;
        if (integer < 0) {
            track = track.reverse();
            integer = -integer;
        }
        track.some((item, idx) => {
            const lineNames = type === 'start' ? item.lineNamesStart : item.lineNamesEnd;
            if (lineNames.includes(customIdent)) {
                num++;
            }
            if (num === integer) {
                index = idx;
                if (type === 'end') {
                    index += 1;
                }
                return true;
            }
        });
        return index;
    }
    parseGridPlacement(track, start, end, initSize) {
        const pos = { start: -1, end: -1, size: 1 };
        if (start.span) {
            if (end.span) {
                if (start.customIdent)
                    return pos;
                if (start.integer) {
                    pos.size = start.integer;
                    return pos;
                }
            }
            else if (end.customIdent) {
                pos.end = this.findPositionByCustomIdent(track, end, 'end');
                if (pos.end === -1) {
                    pos.end = initSize + 1;
                }
            }
            else if (end.integer) {
                if (end.integer > -1) {
                    pos.end = end.integer - 1;
                }
                else {
                    pos.end = track.length + end.integer + 1;
                }
            }
            if (start.customIdent) {
                if (pos.end > -1) {
                    for (let i = pos.end - 1; i >= 0; i--) {
                        let lineNamesStart = [];
                        if (track[i]) {
                            lineNamesStart = track[i].lineNamesStart;
                        }
                        else if (i > 0 && track[i - 1]) {
                            lineNamesStart = track[i - 1].lineNamesEnd;
                        }
                        if (lineNamesStart.includes(start.customIdent)) {
                            pos.start = i;
                            break;
                        }
                    }
                }
            }
            else if (start.integer) {
                pos.start = Math.max(0, pos.end - start.integer);
                pos.end = pos.start + start.integer;
            }
        }
        else {
            if (start.customIdent) {
                pos.start = this.findPositionByCustomIdent(track, start, 'start');
                if (pos.start === -1) {
                    const size = initSize + 1;
                    if (!end.span && end.customIdent) {
                        const index = this.findPositionByCustomIdent(track, end, 'start');
                        if (index > -1) {
                            pos.start = index;
                            pos.end = size;
                        }
                        else {
                            pos.start = size;
                            pos.end = pos.start + 1;
                        }
                        return pos;
                    }
                    else if (!end.span && end.integer) {
                        const integer = end.integer - 1;
                        if (integer > size) {
                            pos.start = size;
                            pos.end = integer;
                        }
                        else {
                            pos.start = integer;
                            pos.end = size === integer ? size + 1 : size;
                        }
                        return pos;
                    }
                }
            }
            else if (start.integer) {
                pos.start = start.integer - 1;
            }
            if (end.span) {
                if (pos.start === -1) {
                    pos.start = 0;
                }
                if (end.customIdent) {
                    for (let i = pos.start; i < track.length; i++) {
                        if (track[i].lineNamesEnd.includes(end.customIdent)) {
                            pos.end = i + 1;
                            break;
                        }
                    }
                    if (pos.end === -1) {
                        pos.end = initSize + 1;
                    }
                }
                else if (end.integer) {
                    pos.end = pos.start + end.integer;
                }
            }
            else if (end.customIdent) {
                pos.end = this.findPositionByCustomIdent(track, end, 'end');
                if (pos.end === -1) {
                    if (!start.span && start.customIdent) {
                        const index = this.findPositionByCustomIdent(track, end, 'start');
                        if (index === -1) {
                            pos.end = initSize + 1;
                        }
                        else if (index < pos.start) {
                            pos.end = pos.start;
                            pos.start = index;
                        }
                    }
                    else if (!start.span && !start.customIdent && !start.integer) {
                        pos.end = initSize + 1;
                    }
                }
            }
            else if (end.integer) {
                if (end.integer < 0) {
                    pos.end = track.length + end.integer + 1;
                }
                else {
                    pos.end = end.integer - 1;
                }
            }
        }
        if (pos.start > -1 && pos.end === -1) {
            pos.end = pos.start + 1;
        }
        else if (pos.end > -1 && pos.start === -1) {
            pos.start = pos.end - 1;
        }
        else if (pos.start !== -1 && pos.start === pos.end) {
            pos.end++;
        }
        if (pos.start > pos.end) {
            const tmp = pos.end;
            pos.end = pos.start;
            pos.start = tmp;
        }
        return pos;
    }
}
