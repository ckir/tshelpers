import { Tokenizer } from './base.js';
export class AreaTokenizer extends Tokenizer {
    getTokens() {
        const areas = [];
        let tokens = [];
        let token = '';
        let index = 0;
        let start = false;
        while (index < this.length) {
            const char = this.text[index];
            if (char === '"') {
                if (!start) {
                    start = true;
                }
                else {
                    start = false;
                    if (token) {
                        tokens.push(token);
                        token = '';
                    }
                    areas.push(tokens);
                    tokens = [];
                }
            }
            else {
                const isWhitespace = this.isWhitespace(char);
                if (isWhitespace) {
                    if (token) {
                        tokens.push(token);
                        token = '';
                    }
                }
                else {
                    token += char;
                }
            }
            index++;
        }
        if (token) {
            throw new Error(`area syntax error`);
        }
        return areas;
    }
}
