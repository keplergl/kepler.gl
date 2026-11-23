// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {JsonDocumentValidator} from './json-document-validator';

function accepts(chunks: string[]): boolean {
  try {
    const validator = new JsonDocumentValidator();
    for (const chunk of chunks) validator.write(chunk);
    validator.finish();
    return true;
  } catch {
    return false;
  }
}

function acceptsJson(text: string): boolean {
  try {
    JSON.parse(text);
    return true;
  } catch {
    return false;
  }
}

describe('MCP JSON document validation', () => {
  const valid = [
    '{}',
    '[]',
    ' {"features":[{"geometry":{"coordinates":[-122.4,37.8]},"properties":{"name":"a"}}]} \n',
    '[{},[],{"a":[],"b":{}},[1,2,3]]',
    '{"empty":"","escapes":"\\"\\\\\\/\\b\\f\\n\\r\\t","unicode":"\\u00a9\\uD83D\\uDE00"}',
    '{"emoji":"😀","duplicate":1,"duplicate":2}',
    '[0,-0,123,-12,0.25,-0.25,1e2,1E+02,-1.25e-10,1e9999]',
    '[true,false,null]',
    'true',
    'false',
    'null',
    '0',
    '-123.456e+7',
    '"primitive"',
    '"\\uD800"'
  ];
  const invalid = [
    '',
    ' \t\r\n',
    '{',
    '[',
    '{"a"',
    '{"a":',
    '{"a":1',
    '{"features":[{"type":"Feature"},',
    '[1,2',
    '"unterminated',
    '"escape\\',
    '"\\u',
    '"\\u12',
    '"\\u12x4"',
    '"\\q"',
    '"newline\n"',
    '"tab\t"',
    '"control\u0000"',
    '[1,]',
    '{"a":1,}',
    '[,1]',
    '[1 2]',
    '{"a" 1}',
    '{"a":1 "b":2}',
    '{a:1}',
    '{"a",1}',
    '[}',
    '{]',
    '{}{}',
    '[] true',
    '{} garbage',
    '[truefalse]',
    'tru',
    'fals',
    'nul',
    'True',
    'undefined',
    'NaN',
    'Infinity',
    '+1',
    '01',
    '-01',
    '--1',
    '-',
    '.1',
    '1.',
    '1e',
    '1e+',
    '1e-',
    '1e.1',
    '1.2.3',
    '1e2e3',
    '[1e]',
    '[0x10]',
    '[1\u00a02]'
  ];

  it.each([...valid, ...invalid])('matches JSON.parse across every split of %j', text => {
    const expected = acceptsJson(text);
    for (let boundary = 0; boundary <= text.length; boundary++) {
      expect(accepts([text.slice(0, boundary), text.slice(boundary)])).toBe(expected);
    }
    expect(accepts(text.split(''))).toBe(expected);
  });

  it('validates a multi-megabyte value incrementally without constructing that value', () => {
    const validator = new JsonDocumentValidator();
    validator.write('{"large":"');
    const chunk = 'x'.repeat(64 * 1024);
    for (let index = 0; index < 64; index++) validator.write(chunk);
    validator.write('\\u0041');
    validator.write('","after":[true,null,1.25e-3]}');

    expect(() => validator.finish()).not.toThrow();
  });

  it('rejects truncation after a long streamed value rather than treating prior rows as complete', () => {
    const validator = new JsonDocumentValidator();
    validator.write('{"features":[{"properties":{"large":"');
    const chunk = 'x'.repeat(64 * 1024);
    for (let index = 0; index < 32; index++) validator.write(chunk);
    validator.write('"}},');

    expect(() => validator.finish()).toThrow(/Unexpected end/);
  });
});
