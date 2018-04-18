// Copyright (c) 2018 Uber Technologies, Inc.
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

import {cdnUrl} from '../utils';

export const SECTIONS = [
  {
    id: 'showcase',
    title: 'Map Enthusiast?',
    description: 'Make beautiful maps, without code.',
    icon: cdnUrl('icons/showcase.png')
  },
  {
    id: 'walkthrough',
    title: 'Data Scientist?',
    description: 'Get data insights, effortlessly.',
    icon: cdnUrl('icons/walkthrough.png'),
    theme: 'dark'
  },
  {
    id: 'features',
    title: 'Software Engineer?',
    description: 'One stop solution, right now.',
    icon: cdnUrl('icons/features.png')
  },
  {
    id: 'examples',
    title: 'See What People Created',
    description: 'See what others have been creating with Kepler.',
    icon: cdnUrl('icons/examples.png')
  },
  {
    id: 'tutorials',
    title: 'Getting Started',
    description: 'Read our tutorials to get started learning about the powerful features kepler ships with.',
    icon: cdnUrl('icons/tutorials.png')
  },
]