// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {AutoLinkNode, LinkNode} from '@lexical/link';
import type {Klass, LexicalNode} from 'lexical';

const LexicalNodes: Array<Klass<LexicalNode>> = [AutoLinkNode, LinkNode];

export default LexicalNodes;
