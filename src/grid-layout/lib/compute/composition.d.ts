import { Container } from '../container';
import { TrackList, GridCell } from '../util/config';
export declare class Composition {
    container: Container;
    rowTrack: TrackList;
    columnTrack: TrackList;
    cells: GridCell[][];
    constructor(container: Container);
    parseCellSize(): void;
    parseNodeSize(): void;
    compose(): void;
}
