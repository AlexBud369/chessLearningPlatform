import { formatMoveToken } from '../../../shared/lib/formatMoveNotation';
import type { ParsedMove } from './usePgnParser';

export interface GameTreeNode {
  id: string;
  san: string;
  fen: string;
  children: GameTreeNode[];
  comment?: string;
}

export interface GameTree {
  startFen: string;
  root: GameTreeNode;
}

let nodeCounter = 0;

const nextNodeId = () => {
  nodeCounter += 1;
  return `n-${nodeCounter}`;
};

export const resetGameTreeIds = () => {
  nodeCounter = 0;
};

export const createGameTree = (startFen: string): GameTree => ({
  startFen,
  root: { id: 'root', san: '', fen: startFen, children: [] },
});

export const findGameTreeNode = (root: GameTreeNode, id: string): GameTreeNode | null => {
  if (root.id === id) return root;
  for (const child of root.children) {
    const found = findGameTreeNode(child, id);
    if (found) return found;
  }
  return null;
};

export const getNodeFen = (tree: GameTree, nodeId: string): string => {
  if (nodeId === 'root') return tree.startFen;
  return findGameTreeNode(tree.root, nodeId)?.fen ?? tree.startFen;
};

export const getParentNode = (root: GameTreeNode, id: string): GameTreeNode | null => {
  for (const child of root.children) {
    if (child.id === id) return root;
    const found = getParentNode(child, id);
    if (found) return found;
  }
  return null;
};

const cloneTree = (node: GameTreeNode): GameTreeNode => ({
  ...node,
  children: node.children.map(cloneTree),
});

export const gameTreeFromMainLine = (
  startFen: string,
  moves: ParsedMove[],
  comments: Record<string, string> = {}
): GameTree => {
  resetGameTreeIds();
  const tree = createGameTree(startFen);
  let parent = tree.root;

  moves.forEach((move) => {
    const node: GameTreeNode = {
      id: nextNodeId(),
      san: move.san,
      fen: move.fen,
      children: [],
      comment: comments[String(move.index)] ?? comments[`${move.index}`],
    };
    parent.children = [node];
    parent = node;
  });

  return tree;
};

export const getMainLineMoves = (tree: GameTree): ParsedMove[] => {
  const moves: ParsedMove[] = [];
  let current = tree.root;

  while (current.children.length > 0) {
    const child = current.children[0];
    moves.push({ index: moves.length, san: child.san, fen: child.fen });
    current = child;
  }

  return moves;
};

export const addMoveToGameTree = (
  tree: GameTree,
  parentId: string,
  san: string,
  fen: string
): { tree: GameTree; nodeId: string } => {
  const root = cloneTree(tree.root);
  const parent = findGameTreeNode(root, parentId);
  if (!parent) return { tree, nodeId: parentId };

  const duplicate = parent.children.find((child) => child.san === san);
  if (duplicate) {
    return { tree: { ...tree, root }, nodeId: duplicate.id };
  }

  const node: GameTreeNode = {
    id: nextNodeId(),
    san,
    fen,
    children: [],
  };

  parent.children.push(node);
  return { tree: { startFen: tree.startFen, root }, nodeId: node.id };
};

export const getMainLineChild = (node: GameTreeNode): GameTreeNode | null => node.children[0] ?? null;

export const getPathFromRoot = (root: GameTreeNode, targetId: string): GameTreeNode[] => {
  const walk = (node: GameTreeNode, path: GameTreeNode[]): GameTreeNode[] | null => {
    const nextPath = [...path, node];
    if (node.id === targetId) return nextPath;

    for (const child of node.children) {
      const found = walk(child, nextPath);
      if (found) return found;
    }
    return null;
  };

  return walk(root, []) ?? [root];
};

export const updateNodeComment = (tree: GameTree, nodeId: string, comment: string): GameTree => {
  const root = cloneTree(tree.root);
  const node = findGameTreeNode(root, nodeId);
  if (!node) return tree;
  node.comment = comment;
  return { ...tree, root };
};

export interface MoveTreeSegment {
  nodeId: string;
  label: string;
  san: string;
}

export interface MoveTreeLine {
  kind: 'main' | 'variation';
  indent: number;
  segments: MoveTreeSegment[];
}

const buildVariationLine = (
  startFen: string,
  node: GameTreeNode,
  ply: number,
  indent: number
): MoveTreeLine[] => {
  const lines: MoveTreeLine[] = [];
  const firstLine: MoveTreeLine = {
    kind: 'variation',
    indent,
    segments: [
      {
        nodeId: node.id,
        san: node.san,
        label: formatMoveToken(startFen, ply, node.san),
      },
    ],
  };

  let current = node;
  let currentPly = ply + 1;

  while (current.children.length > 0) {
    const mainChild = current.children[0];
    firstLine.segments.push({
      nodeId: mainChild.id,
      san: mainChild.san,
      label: formatMoveToken(startFen, currentPly, mainChild.san),
    });

    for (let i = 1; i < current.children.length; i++) {
      lines.push(...buildVariationLine(startFen, current.children[i], currentPly, indent + 1));
    }

    current = mainChild;
    currentPly += 1;
  }

  lines.unshift(firstLine);
  return lines;
};

export const buildMoveTreeLines = (tree: GameTree): MoveTreeLine[] => {
  const lines: MoveTreeLine[] = [];
  const mainLine: MoveTreeLine = { kind: 'main', indent: 0, segments: [] };

  let current = tree.root;
  let ply = 0;

  while (current.children.length > 0) {
    const mainChild = current.children[0];
    mainLine.segments.push({
      nodeId: mainChild.id,
      san: mainChild.san,
      label: formatMoveToken(tree.startFen, ply, mainChild.san),
    });

    for (let i = 1; i < current.children.length; i++) {
      lines.push(...buildVariationLine(tree.startFen, current.children[i], ply, 1));
    }

    current = mainChild;
    ply += 1;
  }

  if (mainLine.segments.length > 0) {
    lines.unshift(mainLine);
  }

  return lines;
};

export const commentsMapFromTree = (tree: GameTree): Record<string, string> => {
  const comments: Record<string, string> = {};

  const walk = (node: GameTreeNode) => {
    if (node.comment && node.id !== 'root') {
      comments[node.id] = node.comment;
    }
    node.children.forEach(walk);
  };

  walk(tree.root);
  return comments;
};

export const applyCommentsToTree = (tree: GameTree, comments: Record<string, string>): GameTree => {
  const root = cloneTree(tree.root);

  const walk = (node: GameTreeNode) => {
    if (node.id !== 'root' && comments[node.id]) {
      node.comment = comments[node.id];
    }
    node.children.forEach(walk);
  };

  walk(root);
  return { ...tree, root };
};

export const getMainLineNodeIds = (tree: GameTree): string[] => {
  const ids: string[] = [];
  let current = tree.root;
  while (current.children[0]) {
    ids.push(current.children[0].id);
    current = current.children[0];
  }
  return ids;
};

export const applyCommentsByMainLineIndex = (
  tree: GameTree,
  indexComments: Record<number, string>
): GameTree => {
  const nodeComments: Record<string, string> = {};
  let current = tree.root;
  let index = 0;

  while (current.children[0]) {
    if (indexComments[index]) {
      nodeComments[current.children[0].id] = indexComments[index];
    }
    current = current.children[0];
    index += 1;
  }

  return applyCommentsToTree(tree, nodeComments);
};
