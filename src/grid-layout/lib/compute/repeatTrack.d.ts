import { Container } from '../container';
import { TrackList, TrackType } from '../util/config';
export declare class RepeatTrackCompute {
    trackList: TrackList;
    container: Container;
    type: TrackType;
    constructor(trackList: TrackList, container: Container, type: TrackType);
    private expandFixedRepeat;
    get size(): number;
    get gap(): number;
    private getTrackItemValue;
    private parseAutoRepeat;
    private mergeLineNames;
    parse(): void;
}
