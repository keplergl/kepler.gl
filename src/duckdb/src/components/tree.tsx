// SPDX-License-Identifier: MIT
// Copyright contributors to the kepler.gl project

import {Collapsible, CollapsibleTrigger, CollapsibleContent} from '@radix-ui/react-collapsible';
import styled from 'styled-components';
import React, {useEffect, useState} from 'react';
import classNames from 'classnames';

import {Icons, FieldToken} from '@kepler.gl/components';

export type TreeNodeData<T> = {
  key: string;
  object: T;
  children?: TreeNodeData<T>[];
  isOpen?: boolean;
};

export type TreeProps<T> = {
  className?: string;
  treeData: TreeNodeData<T>;
  renderNode: TreeNodeProps<T>['renderNode'];
};

// TODO: consider using react-vtree/react-window for virtualization

/**
 * Component that renders a generic tree.
 * @param treeData - The tree data.
 * @param renderNode - A function that renders a tree node.
 */
export function Tree<T>(props: TreeProps<T>): React.ReactElement {
  const {treeData, renderNode} = props;
  return (
    <div className="flex flex-col">
      <TreeNode<T> treeData={treeData} renderNode={renderNode} />
    </div>
  );
}

export type TreeNodeProps<T> = {
  treeData: TreeNodeData<T>;
  renderNode: (node: TreeNodeData<T>, isOpen: boolean) => JSX.Element | null;
};

const StyledCollapsibleTriggerContent = styled.div`
  display: flex;
  width: 100%;
  cursor: pointer;
  align-items: center;
`;
/**
 * Component that renders a tree node.
 */
function TreeNode<T>(props: TreeNodeProps<T>): JSX.Element | null {
  const {treeData, renderNode} = props;
  const {children} = treeData;
  const [isOpen, setIsOpen] = useState(Boolean(treeData.isOpen));
  useEffect(() => {
    setIsOpen(Boolean(treeData.isOpen));
  }, [treeData.isOpen]);
  if (!children) {
    return renderNode(treeData, isOpen);
  }
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="w-full" asChild>
        <StyledCollapsibleTriggerContent>
          <Icons.ArrowRight
            className={classNames('flex-shrink-0 text-gray-500', {'rotate-90 transform': isOpen})}
            height="18px"
          />
          {renderNode(treeData, isOpen)}
        </StyledCollapsibleTriggerContent>
      </CollapsibleTrigger>
      <CollapsibleContent className="pl-4">
        {isOpen
          ? children.map(child => (
              <TreeNode<T> key={child.key} treeData={child} renderNode={renderNode} />
            ))
          : null}
      </CollapsibleContent>
    </Collapsible>
  );
}

const StyledDatasetNode = styled.div`
  font-weight: bold;
`;

export const DatasetNode = ({node}) => {
  return <StyledDatasetNode>{node.object.tableName}</StyledDatasetNode>;
};

const StyledColumnNode = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 0;
  margin-left: 16px;

  .column-name {
    margin-left: 8px;
  }
`;
export const ColumnNode = ({node}) => {
  return (
    <StyledColumnNode>
      <FieldToken type={node.object.fieldType} />
      <div className="column-name">{node.object.name}</div>
    </StyledColumnNode>
  );
};
