import { Tokenizer } from './base.js';
const trackListSplitChars = '()[],/';
export class TrackTokenizer extends Tokenizer {
    getTokens() {
        const tokens = [];
        let token = '';
        let index = 0;
        while (index < this.length) {
            const char = this.text[index];
            const isWhitespace = this.isWhitespace(char);
            if (isWhitespace || trackListSplitChars.indexOf(char) > -1) {
                if (token) {
                    tokens.push(token);
                    token = '';
                }
                index++;
                if (!isWhitespace) {
                    tokens.push(char);
                }
                continue;
            }
            token += char;
            index++;
        }
        if (token) {
            tokens.push(token);
        }
        return tokens;
    }
}
