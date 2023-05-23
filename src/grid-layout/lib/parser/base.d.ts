export declare class Parser {
    tokens: string[];
    text: string;
    index: number;
    length: number;
    constructor(text: string);
    nextNeed(token: string): void;
    peek(): string;
}
