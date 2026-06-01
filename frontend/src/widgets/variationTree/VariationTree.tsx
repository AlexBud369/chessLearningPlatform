import { Box, Typography } from '@mui/material';
import CommentIcon from '@mui/icons-material/Comment';
import { useTranslation } from 'react-i18next';
import { buildMoveTreeLines, type GameTree, type MoveTreeLine } from '../../features/analysis/model/gameTree';

interface VariationTreeProps {
  tree: GameTree;
  selectedNodeId: string;
  onNodeSelect: (nodeId: string) => void;
}

const MoveSegment = ({
  label,
  nodeId,
  selectedNodeId,
  hasComment,
  onSelect,
}: {
  label: string;
  nodeId: string;
  selectedNodeId: string;
  hasComment: boolean;
  onSelect: (nodeId: string) => void;
}) => {
  const isSelected = selectedNodeId === nodeId;

  return (
    <Box
      component="span"
      onClick={() => onSelect(nodeId)}
      sx={{
        cursor: 'pointer',
        fontFamily: 'monospace',
        fontSize: '0.8125rem',
        fontWeight: isSelected ? 700 : 400,
        bgcolor: isSelected ? 'action.selected' : 'transparent',
        borderRadius: 0.5,
        px: 0.25,
        py: 0.125,
        mr: 0.25,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.25,
        '&:hover': { bgcolor: 'action.hover' },
      }}
    >
      {label}
      {hasComment && <CommentIcon sx={{ fontSize: 12, opacity: 0.7 }} />}
    </Box>
  );
};

const MoveLineRow = ({
  line,
  tree,
  selectedNodeId,
  onSelect,
}: {
  line: MoveTreeLine;
  tree: GameTree;
  selectedNodeId: string;
  onSelect: (nodeId: string) => void;
}) => (
  <Box
    sx={{
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'baseline',
      pl: line.kind === 'variation' ? line.indent * 1.5 : 0,
      mb: 0.25,
    }}
  >
    {line.kind === 'variation' && (
      <Typography
        component="span"
        sx={{ fontFamily: 'monospace', fontSize: '0.8125rem', color: 'text.secondary', mr: 0.5 }}
      >
        |
      </Typography>
    )}
    {line.segments.map((segment, index) => (
      <MoveSegment
        key={`${segment.nodeId}-${index}`}
        label={segment.label}
        nodeId={segment.nodeId}
        selectedNodeId={selectedNodeId}
        hasComment={Boolean(findComment(tree, segment.nodeId))}
        onSelect={onSelect}
      />
    ))}
  </Box>
);

const findComment = (tree: GameTree, nodeId: string): string | undefined => {
  const walk = (node: typeof tree.root): string | undefined => {
    if (node.id === nodeId) return node.comment;
    for (const child of node.children) {
      const found = walk(child);
      if (found) return found;
    }
    return undefined;
  };
  return walk(tree.root);
};

export const VariationTree = ({ tree, selectedNodeId, onNodeSelect }: VariationTreeProps) => {
  const { t } = useTranslation();
  const lines = buildMoveTreeLines(tree);

  return (
    <Box sx={{ height: '100%', overflow: 'auto' }}>
      <Typography variant="subtitle2" sx={{ mb: 1, fontSize: '0.8125rem' }}>
        {t('analysis.variationTree')}
      </Typography>
      {lines.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          {t('analysis.playOnBoardHint')}
        </Typography>
      ) : (
        lines.map((line, index) => (
          <MoveLineRow
            key={`${line.kind}-${index}-${line.segments[0]?.nodeId ?? 'empty'}`}
            line={line}
            tree={tree}
            selectedNodeId={selectedNodeId}
            onSelect={onNodeSelect}
          />
        ))
      )}
    </Box>
  );
};

export default VariationTree;
