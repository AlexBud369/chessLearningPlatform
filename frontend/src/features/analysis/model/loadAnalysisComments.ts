import type { ParsedMove } from './usePgnParser';

type ApiTreeNode = {
  move_to: string | null;
  comment: string | null;
  children?: ApiTreeNode[];
};

const flattenMainLine = (nodes: ApiTreeNode[]): ApiTreeNode[] => {
  const line: ApiTreeNode[] = [];
  let current: ApiTreeNode | undefined = nodes[0];

  while (current) {
    if (current.move_to) {
      line.push(current);
    }
    const next: ApiTreeNode | undefined =
      current.children && current.children.length > 0 ? current.children[0] : undefined;
    current = next;
  }

  return line;
};

export const extractCommentsFromTree = (
  nodes: ApiTreeNode[],
  moves: ParsedMove[]
): Record<number, string> => {
  const line = flattenMainLine(nodes);
  const comments: Record<number, string> = {};

  line.forEach((node, i) => {
    const move = moves[i];
    if (move && node.comment) {
      comments[move.index] = node.comment;
    }
  });

  return comments;
};
