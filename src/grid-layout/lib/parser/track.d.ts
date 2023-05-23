import { Parser } from './base';
import { TrackItem, TrackList } from '../util/config';
type conditionChecker = (val: string) => boolean;
export declare class TrackParser extends Parser {
    trackList: TrackList;
    parse(): void;
    parseValue(value: string): TrackItem;
    parseFitContent(): TrackItem;
    private parseMinMax;
    parseLineNames(): string[];
    parseRepeatNum(val: string): number | 'auto-fill' | 'auto-fit';
    parseRepeat(): TrackItem;
    parseCondition(checkFn: conditionChecker, supports: string[]): TrackList;
    checkAutoRepeatTrack(list: TrackList): void;
    checkTrack(trackList: TrackList): void;
}
export {};
