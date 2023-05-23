import { TrackList, GridCell, TrackType } from '../util/config';
import { Container } from '../container';
export declare class TrackCompute {
    trackList: TrackList;
    cells: GridCell[][];
    container: Container;
    type: TrackType;
    containerSize: number;
    freeSpace: number;
    gap: number;
    constructor(trackList: TrackList, cells: GridCell[][], container: Container, type: TrackType);
    private parseTrackItemValue;
    private removeEmptyAutoFitTrack;
    private parseTrackSize;
    private getTrackNodes;
    private getNodeInCellSize;
    private parseMinContent;
    private parseMaxContent;
    private parseFitContent;
    private parseFrTrack;
    private parseMinMaxTrack;
    private parseAutoTrack;
    private parseTrackPosition;
    parse(): void;
}
