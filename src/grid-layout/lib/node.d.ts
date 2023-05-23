import { NodeConfig, GridPlacement, BoundingRect, GridCell } from './util/config';
import { Container } from './container';
export declare class Node {
    id: number;
    parent: Container;
    config: NodeConfig;
    boundingRect: BoundingRect;
    cells: GridCell[];
    placement: GridPlacement;
    constructor(config?: NodeConfig);
    parse(): void;
    private parseGridLine;
    private parseCombineProperty;
    private parseSize;
    private getComputedWidth;
    private getLayoutWidth;
    private getComputedHeight;
    private getLayoutHeight;
    get minContentWidth(): number;
    get maxContentWidth(): number;
    get minContentHeight(): number;
    get maxContentHeight(): number;
    private parseAutoMargin;
    private parseAlign;
    parsePosition(boundingRect: BoundingRect): void;
    getComputedLayout(): BoundingRect;
}
