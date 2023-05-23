import { Node } from './node';
import { ContainerConfig, ContainerBoundingRect } from './util/config';
export declare class Container {
    children: Node[];
    config: ContainerConfig;
    constructor(config: ContainerConfig);
    appendChild(node: Node): this;
    private parseOrder;
    private parse;
    calculateLayout(): void;
    getAllComputedLayout(): ContainerBoundingRect;
}
