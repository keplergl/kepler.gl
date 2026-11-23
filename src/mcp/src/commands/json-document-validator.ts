// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

type ContainerState =
  | 'array-first'
  | 'array-value'
  | 'array-next'
  | 'object-first'
  | 'object-key'
  | 'object-colon'
  | 'object-value'
  | 'object-next';

type NumberState =
  | 'sign'
  | 'zero'
  | 'integer'
  | 'dot'
  | 'fraction'
  | 'exponent'
  | 'exponent-sign'
  | 'exponent-digits';

const isDigit = (character: string) => character >= '0' && character <= '9';
const isWhitespace = (character: string) =>
  character === ' ' || character === '\t' || character === '\r' || character === '\n';

/**
 * Syntax-only validation for MCP document-JSON imports. The loader still builds
 * the rows; this keeps only nesting and lexical state, even for very long values.
 */
export class JsonDocumentValidator {
  private readonly containers: ContainerState[] = [];
  private rootComplete = false;
  private token: 'string' | 'number' | 'literal' | undefined;
  private keyString = false;
  private escaped = false;
  private unicodeRemaining = 0;
  private numberState: NumberState = 'integer';
  private literal = '';
  private literalIndex = 0;
  private offset = 0;

  write(chunk: string): void {
    for (const character of chunk) {
      this.offset++;
      if (this.token === 'string') {
        this.consumeString(character);
        continue;
      }
      if (this.token === 'literal') {
        if (character !== this.literal[this.literalIndex++]) this.invalid();
        if (this.literalIndex === this.literal.length) {
          this.token = undefined;
          this.completeValue();
        }
        continue;
      }
      if (this.token === 'number') {
        if (this.consumeNumber(character)) continue;
        this.finishNumber();
        // A number's terminating delimiter belongs to the enclosing container.
      }
      if (isWhitespace(character)) continue;
      this.consumeStructure(character);
    }
  }

  finish(): void {
    if (this.token === 'number') this.finishNumber();
    if (this.token || this.containers.length || !this.rootComplete) {
      this.invalid('Unexpected end of JSON document');
    }
  }

  private invalid(message = 'Invalid JSON syntax'): never {
    throw new Error(`${message} at character ${this.offset}.`);
  }

  private completeValue(): void {
    const index = this.containers.length - 1;
    if (index < 0) this.rootComplete = true;
    else if (this.containers[index] === 'object-value') this.containers[index] = 'object-next';
    else this.containers[index] = 'array-next';
  }

  private consumeStructure(character: string): void {
    const index = this.containers.length - 1;
    const state = this.containers[index];
    if (state === 'object-colon') {
      if (character !== ':') this.invalid();
      this.containers[index] = 'object-value';
      return;
    }
    if (state === 'array-next' || state === 'object-next') {
      if (character === ',') {
        this.containers[index] = state === 'array-next' ? 'array-value' : 'object-key';
      } else if (character === (state === 'array-next' ? ']' : '}')) {
        this.containers.pop();
      } else this.invalid();
      return;
    }
    if (
      (state === 'array-first' && character === ']') ||
      (state === 'object-first' && character === '}')
    ) {
      this.containers.pop();
      return;
    }
    if (state === 'object-first' || state === 'object-key') {
      if (character !== '"') this.invalid();
      this.token = 'string';
      this.keyString = true;
      return;
    }
    if (index < 0 && this.rootComplete) this.invalid('Unexpected content after JSON document');
    if (character === '{' || character === '[') {
      this.completeValue();
      this.containers.push(character === '{' ? 'object-first' : 'array-first');
    } else if (character === '"') {
      this.token = 'string';
      this.keyString = false;
    } else if (character === '-' || isDigit(character)) {
      this.token = 'number';
      this.numberState = character === '-' ? 'sign' : character === '0' ? 'zero' : 'integer';
    } else if (character === 't' || character === 'f' || character === 'n') {
      this.token = 'literal';
      this.literal = character === 't' ? 'true' : character === 'f' ? 'false' : 'null';
      this.literalIndex = 1;
    } else this.invalid();
  }

  private consumeString(character: string): void {
    if (this.unicodeRemaining) {
      if (!/^[0-9a-f]$/i.test(character)) this.invalid('Invalid Unicode escape');
      this.unicodeRemaining--;
    } else if (this.escaped) {
      this.escaped = false;
      if (character === 'u') this.unicodeRemaining = 4;
      else if (!'"\\/bfnrt'.includes(character)) this.invalid('Invalid string escape');
    } else if (character === '\\') {
      this.escaped = true;
    } else if (character === '"') {
      this.token = undefined;
      if (this.keyString) this.containers[this.containers.length - 1] = 'object-colon';
      else this.completeValue();
    } else if (character.charCodeAt(0) < 0x20) {
      this.invalid('Unescaped control character in JSON string');
    }
  }

  private consumeNumber(character: string): boolean {
    const digit = isDigit(character);
    switch (this.numberState) {
      case 'sign':
        if (!digit) this.invalid('Expected a digit after minus');
        this.numberState = character === '0' ? 'zero' : 'integer';
        return true;
      case 'zero':
        if (digit) this.invalid('Leading zero in JSON number');
        break;
      case 'integer':
        if (digit) return true;
        break;
      case 'dot':
      case 'exponent-sign':
        if (!digit) this.invalid('Expected a digit in JSON number');
        this.numberState = this.numberState === 'dot' ? 'fraction' : 'exponent-digits';
        return true;
      case 'fraction':
      case 'exponent-digits':
        if (digit) return true;
        break;
      case 'exponent':
        if (character === '+' || character === '-') {
          this.numberState = 'exponent-sign';
          return true;
        }
        if (!digit) this.invalid('Expected a digit in JSON exponent');
        this.numberState = 'exponent-digits';
        return true;
    }
    if (character === '.' && (this.numberState === 'zero' || this.numberState === 'integer')) {
      this.numberState = 'dot';
      return true;
    }
    if (
      (character === 'e' || character === 'E') &&
      ['zero', 'integer', 'fraction'].includes(this.numberState)
    ) {
      this.numberState = 'exponent';
      return true;
    }
    return false;
  }

  private finishNumber(): void {
    if (!['zero', 'integer', 'fraction', 'exponent-digits'].includes(this.numberState)) {
      this.invalid('Incomplete JSON number');
    }
    this.token = undefined;
    this.completeValue();
  }
}
