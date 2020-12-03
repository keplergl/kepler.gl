// Copyright (c) 2020 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

/**
 * Stubbed Typescript types for certain classes in @deck.gl/core
 * TODO: This is initially focused on fixing things for our own usage;
 * we should eventually package proper types with the module.
 */
declare module '@deck.gl/core' {
  export class Layer {
    constructor(any): Layer;
    id: string;
    state: any;
    props: any;
    context: any;
    draw(any): void;
    setState(any): void;
    setNeedsUpdate(): void;
    setNeedsRedraw(): void;
    getShaders(any?): any;
    getAttributeManager(): any;
    use64bitPositions(): boolean;
    finalizeState(): void;
  }

  export class CompositeLayer extends Layer {
    getSubLayerAccessor(any): any;
    getSubLayerProps(any): any;
    getSubLayerRow(any, any, number): any;
  }

  export class SimpleMeshLayer extends Layer {}

  export const log = any;
  export const project32: any;
  export const picking: any;

  export const FlyToInterpolator: any;
  export const _GlobeView: any;
  export const MapView: any;

  interface ConstantMap {
    [key: string]: string;
  }

  export const COORDINATE_SYSTEM: ConstantMap;
}
