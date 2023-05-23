import { deepmerge } from '../util/util.js';
import { isFixedBreadth, isAutoRepeat, isFixedRepeat, isAutoFitRepeat } from '../util/track';
export class RepeatTrackCompute {
    trackList;
    container;
    type;
    constructor(trackList, container, type) {
        this.trackList = trackList;
        this.container = container;
        this.type = type;
    }
    expandFixedRepeat(track, num) {
        const repeatNum = (num || track.args[0]);
        const repeatValue = track.args[1];
        const result = [];
        let i = 0;
        while (i++ < repeatNum) {
            repeatValue.forEach(item => {
                result.push(deepmerge(item));
            });
        }
        return result;
    }
    get size() {
        return this.type === 'row' ? this.container.config.height : this.container.config.width;
    }
    get gap() {
        return (this.type === 'row' ? this.container.config.gridRowGap : this.container.config.gridColumnGap);
    }
    getTrackItemValue(item) {
        switch (item.type) {
            case 'px':
                return item.value;
            case '%':
                return Math.round(item.value * this.size / 100);
            case 'minmax':
                const min = item.args[0];
                const max = item.args[1];
                return isFixedBreadth(min) ? min.value : max.value;
        }
        return 0;
    }
    parseAutoRepeat() {
        const gap = this.gap;
        let size = 0;
        let repeatTrack;
        let repeatIndex;
        let isAutoFit = false;
        this.trackList.forEach((item, index) => {
            size += this.getTrackItemValue(item);
            if (isAutoRepeat(item)) {
                repeatTrack = item;
                repeatIndex = index;
                isAutoFit = isAutoFitRepeat(item);
            }
        });
        let leaveSpace = this.size - size;
        let repeatSize = 0;
        const repeatList = repeatTrack.args[1];
        repeatList.forEach(item => {
            repeatSize += this.getTrackItemValue(item);
        });
        let count = 1;
        if (leaveSpace > repeatSize) {
            count = Math.floor(leaveSpace / repeatSize);
            if (gap) {
                const fixLength = this.trackList.length - 1;
                const repeatLength = repeatList.length;
                while (count > 1) {
                    const gapSize = gap * (fixLength + repeatLength * count - 1);
                    if (leaveSpace - gapSize - count * repeatSize > 0) {
                        break;
                    }
                    else {
                        count--;
                    }
                }
            }
        }
        const repeatResult = this.expandFixedRepeat(repeatTrack, count);
        if (isAutoFit) {
            repeatResult.forEach(item => {
                item.autoFit = true;
            });
        }
        this.trackList.splice(repeatIndex, 1, ...repeatResult);
    }
    mergeLineNames() {
        const length = this.trackList.length;
        for (let i = 0; i < length - 1; i++) {
            const current = this.trackList[i];
            const next = this.trackList[i + 1];
            const lineNames = current.lineNamesEnd.concat(next.lineNamesStart);
            const set = new Set(lineNames);
            current.lineNamesEnd = [...set];
            next.lineNamesStart = [...set];
        }
    }
    parse() {
        const result = [];
        let hasAutoRepeat = false;
        this.trackList.forEach(item => {
            if (isFixedRepeat(item)) {
                result.push(...this.expandFixedRepeat(item));
                return;
            }
            else if (isAutoRepeat(item)) {
                hasAutoRepeat = true;
            }
            result.push(item);
        });
        this.trackList = result;
        if (hasAutoRepeat) {
            this.parseAutoRepeat();
        }
        this.mergeLineNames();
    }
}
