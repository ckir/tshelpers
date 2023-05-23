export class Parser {
    tokens;
    text;
    index = 0;
    length;
    constructor(text) {
        this.text = text;
    }
    nextNeed(token) {
        if (this.peek() !== token) {
            throw new Error(`next token must be ${token}`);
        }
    }
    peek() {
        return this.tokens[this.index++];
    }
}
