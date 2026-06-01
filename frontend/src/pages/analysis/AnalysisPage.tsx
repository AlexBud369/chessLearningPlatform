import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Collapse,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CommentIcon from '@mui/icons-material/Comment';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { analysisApi, gamesApi } from '../../shared/api/gamesApi';
import { PgnUploader } from './PgnUploader';
import { usePgnParser } from '../../features/analysis/model/usePgnParser';
import { buildAnalysisSavePayload } from '../../features/analysis/model/buildVariationTree';
import { buildPgnFromMoves } from '../../features/analysis/model/buildPgnFromMoves';
import {
  addMoveToGameTree,
  applyCommentsByMainLineIndex,
  createGameTree,
  findGameTreeNode,
  gameTreeFromMainLine,
  getMainLineMoves,
  getMainLineNodeIds,
  getNodeFen,
  getParentNode,
  updateNodeComment,
  type GameTree,
} from '../../features/analysis/model/gameTree';
import { extractCommentsFromTree } from '../../features/analysis/model/loadAnalysisComments';
import { Chessboard } from '../../shared/ui/Chessboard/Chessboard';
import { BoardControls } from '../../shared/ui/Chessboard/BoardControls';
import { VariationTree } from '../../widgets/variationTree/VariationTree';
import { Breadcrumbs } from '../../shared/ui/Breadcrumbs/Breadcrumbs';
import { ROUTES } from '../../shared/constants/routes';
import { PAGE_HORIZONTAL_PADDING, PAGE_MAX_WIDTH } from '../../shared/constants/pageLayout';
import { flipBoardOrientation, getSideToMove, switchSideToMove } from '../../shared/lib/chessFen';
import { tryMoveFromSquares } from '../../shared/lib/chessPuzzle';
import { useAppSelector } from '../../shared/lib/hooks';

const BOARD_MAX_WIDTH = 480;
const TREE_WIDTH = 280;
const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

export const AnalysisPage = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { parsePgn } = usePgnParser();
  const user = useAppSelector((state) => state.user.user);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [gameTree, setGameTree] = useState<GameTree>(() => createGameTree(START_FEN));
  const [headers, setHeaders] = useState<Record<string, string>>({});
  const [selectedNodeId, setSelectedNodeId] = useState('root');
  const [boardFen, setBoardFen] = useState(START_FEN);
  const [boardOrientation, setBoardOrientation] = useState<'white' | 'black'>('white');
  const [uploaderOpen, setUploaderOpen] = useState(false);
  const [gamePgn, setGamePgn] = useState('');
  const [currentGameId, setCurrentGameId] = useState<number | null>(null);
  const [commentDraft, setCommentDraft] = useState('');
  const [commentEditorOpen, setCommentEditorOpen] = useState(false);

  const mainLineMoves = useMemo(() => getMainLineMoves(gameTree), [gameTree]);
  const mainLineNodeIds = useMemo(() => getMainLineNodeIds(gameTree), [gameTree]);

  const selectedNode = useMemo(
    () => (selectedNodeId === 'root' ? gameTree.root : findGameTreeNode(gameTree.root, selectedNodeId)),
    [gameTree, selectedNodeId]
  );

  const canGoNext = Boolean(
    selectedNodeId === 'root' ? gameTree.root.children[0] : selectedNode?.children[0]
  );

  const applyParsedGame = useCallback(
    (pgn: string, parsedComments?: Record<number, string>) => {
      const parsed = parsePgn(pgn);
      if (!parsed) return false;

      let tree = gameTreeFromMainLine(parsed.startFen, parsed.moves);
      if (parsedComments) {
        tree = applyCommentsByMainLineIndex(tree, parsedComments);
      }

      setGameTree(tree);
      setHeaders(parsed.headers);
      setGamePgn(pgn);
      setSelectedNodeId('root');
      setBoardFen(parsed.startFen);
      setCommentDraft('');
      setCommentEditorOpen(false);
      return true;
    },
    [parsePgn]
  );

  const loadGameById = useCallback(
    async (id: number) => {
      setLoading(true);
      try {
        const [gameRes, treeRes] = await Promise.all([
          gamesApi.getGameById(id),
          analysisApi.getTree(id).catch(() => ({ data: [] })),
        ]);

        const game = gameRes.data;
        if (!game.pgn) {
          toast.error(t('analysis.noPgn'));
          return;
        }

        const parsed = parsePgn(game.pgn);
        if (!parsed) {
          toast.error(t('analysis.parseError'));
          return;
        }

        const loadedComments = extractCommentsFromTree(treeRes.data, parsed.moves);
        applyParsedGame(game.pgn, loadedComments);
        setCurrentGameId(id);
      } catch {
        toast.error(t('analysis.loadError'));
      } finally {
        setLoading(false);
      }
    },
    [applyParsedGame, parsePgn, t]
  );

  useEffect(() => {
    if (gameId && !Number.isNaN(Number(gameId))) {
      loadGameById(Number(gameId));
    }
  }, [gameId, loadGameById]);

  const handlePgnSubmit = (pgn: string) => {
    if (applyParsedGame(pgn)) {
      setCurrentGameId(null);
      toast.success(t('analysis.loaded'));
    } else {
      toast.error(t('analysis.parseError'));
    }
  };

  const resolvePgnForSave = useCallback(() => {
    if (mainLineMoves.length > 0) {
      return buildPgnFromMoves(gameTree.startFen, mainLineMoves, headers);
    }
    return gamePgn.trim();
  }, [gamePgn, gameTree.startFen, headers, mainLineMoves]);

  const handleSave = async () => {
    const pgnToSave = resolvePgnForSave();
    if (!pgnToSave) {
      toast.warn(t('analysis.noPgn'));
      return;
    }

    setSaving(true);
    try {
      let savedGameId = currentGameId;
      const comments = mainLineNodeIds.reduce<Record<string, string>>((acc, nodeId) => {
        const node = findGameTreeNode(gameTree.root, nodeId);
        if (node?.comment) acc[nodeId] = node.comment;
        return acc;
      }, {});

      const resultHeader = headers['Result']?.trim();
      const dateHeader = headers['Date']?.trim();
      const datePlayed =
        dateHeader && !dateHeader.includes('?') && /^\d{4}\.\d{1,2}\.\d{1,2}$/.test(dateHeader)
          ? dateHeader
          : undefined;

      if (savedGameId) {
        await gamesApi.updateGame(savedGameId, {
          pgn: pgnToSave,
          ...(resultHeader ? { result: resultHeader } : {}),
          ...(datePlayed ? { datePlayed } : {}),
        });
      } else {
        const response = await gamesApi.uploadPgn({
          pgn: pgnToSave,
          ...(resultHeader ? { result: resultHeader } : {}),
          ...(datePlayed ? { datePlayed } : {}),
        });
        savedGameId = response.data.id;
        setCurrentGameId(savedGameId);
        navigate(`/analysis/${savedGameId}`, { replace: true });
      }

      if (savedGameId && mainLineMoves.length > 0) {
        await analysisApi.saveAnalysis(
          savedGameId,
          buildAnalysisSavePayload(mainLineMoves, comments, mainLineNodeIds)
        );
      }

      setGamePgn(pgnToSave);
      toast.success(t('analysis.saved'));
    } catch {
      toast.error(t('analysis.saveError'));
    } finally {
      setSaving(false);
    }
  };

  const goToNode = (nodeId: string) => {
    setSelectedNodeId(nodeId);
    setBoardFen(getNodeFen(gameTree, nodeId));
    const node = nodeId === 'root' ? null : findGameTreeNode(gameTree.root, nodeId);
    setCommentDraft(node?.comment || '');
    setCommentEditorOpen(false);
  };

  const goPrev = () => {
    if (selectedNodeId === 'root') return;
    const parent = getParentNode(gameTree.root, selectedNodeId);
    goToNode(parent?.id ?? 'root');
  };

  const goNext = () => {
    const child = selectedNodeId === 'root' ? gameTree.root.children[0] : selectedNode?.children[0];
    if (child) goToNode(child.id);
  };

  const handleBoardDrop = (from: string, to: string): boolean => {
    const lineFen = getNodeFen(gameTree, selectedNodeId);
    const result = tryMoveFromSquares(lineFen, from, to);
    if (!result) {
      toast.error(t('tasks.board.illegalMove'));
      return false;
    }

    const { tree: nextTree, nodeId } = addMoveToGameTree(gameTree, selectedNodeId, result.san, result.fen);
    const newPgn = buildPgnFromMoves(nextTree.startFen, getMainLineMoves(nextTree), headers);

    setGameTree(nextTree);
    setSelectedNodeId(nodeId);
    setBoardFen(result.fen);
    setGamePgn(newPgn);
    return true;
  };

  const handleSwitchTurn = () => {
    if (selectedNodeId !== 'root') {
      toast.warn(t('boardControls.switchTurnAtStart'));
      return;
    }
    const nextFen = switchSideToMove(gameTree.startFen);
    const nextTree = { ...gameTree, startFen: nextFen, root: { ...gameTree.root, fen: nextFen } };
    setGameTree(nextTree);
    setBoardFen(nextFen);
  };

  const handleOpenCommentEditor = () => {
    if (selectedNodeId === 'root') return;
    setCommentDraft(selectedNode?.comment || '');
    setCommentEditorOpen(true);
  };

  const handleSaveComment = () => {
    if (selectedNodeId === 'root') return;
    setGameTree(updateNodeComment(gameTree, selectedNodeId, commentDraft.trim()));
    setCommentEditorOpen(false);
    toast.success(t('analysis.commentSaved'));
  };

  const canComment = selectedNodeId !== 'root';
  const canSave = Boolean(resolvePgnForSave()) && Boolean(user);
  const hasMoves = mainLineMoves.length > 0;
  const turn = useMemo(() => getSideToMove(boardFen), [boardFen]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 12, flexGrow: 1 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        flexGrow: 1,
        width: '100%',
        maxWidth: PAGE_MAX_WIDTH,
        mx: 'auto',
        px: PAGE_HORIZONTAL_PADDING,
        py: { xs: 1, sm: 2 },
        boxSizing: 'border-box',
        overflowX: 'hidden',
      }}
    >
      <Box sx={{ mb: 1.5 }}>
        <Breadcrumbs
          items={[
            { label: t('breadcrumbs.home'), path: ROUTES.HOME },
            { label: t('breadcrumbs.analysis'), path: ROUTES.ANALYSIS },
            ...(gameId ? [{ label: t('analysis.gameNumber', { id: gameId }) }] : []),
          ]}
        />
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 0.5 }}>
          <Button size="small" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
            {t('analysis.back')}
          </Button>
          <Typography variant="h6" sx={{ flexGrow: 1, fontSize: { xs: '1rem', sm: '1.2rem' } }}>
            {t('analysis.title')}
          </Typography>
        </Stack>

        {headers['White'] && headers['Black'] && (
          <Stack direction="row" spacing={0.5} sx={{ mt: 0.5 }} flexWrap="wrap" useFlexGap>
            <Chip label={`⬜ ${headers['White']}`} size="small" />
            <Chip label={`⬛ ${headers['Black']}`} size="small" />
            {headers['Result'] && <Chip label={headers['Result']} variant="outlined" size="small" />}
          </Stack>
        )}
      </Box>

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={{ xs: 1, md: 2 }}
        sx={{ mb: 1.5, alignItems: { md: 'flex-start' } }}
      >
        <Box sx={{ width: { xs: '100%', md: BOARD_MAX_WIDTH }, maxWidth: '100%', flexShrink: 0 }}>
          <Chessboard
            position={boardFen}
            orientation={boardOrientation}
            arePiecesDraggable
            onPieceDrop={handleBoardDrop}
            compact={false}
            maxWidth={BOARD_MAX_WIDTH}
          />
          <BoardControls
            onFlipBoard={() => setBoardOrientation(flipBoardOrientation(boardOrientation))}
            onSwitchTurn={handleSwitchTurn}
          />
        </Box>

        <Paper
          sx={{
            width: { xs: '100%', md: TREE_WIDTH },
            flexShrink: 0,
            p: 1,
            minHeight: { xs: 140, md: BOARD_MAX_WIDTH },
            maxHeight: { xs: 220, md: BOARD_MAX_WIDTH },
            overflow: 'auto',
          }}
        >
          <VariationTree tree={gameTree} selectedNodeId={selectedNodeId} onNodeSelect={goToNode} />
        </Paper>
      </Stack>

      <Paper sx={{ p: { xs: 1, sm: 1.5 } }}>
        <Stack
          direction={{ xs: 'column', lg: 'row' }}
          spacing={1}
          alignItems={{ lg: 'center' }}
          sx={{ mb: commentEditorOpen ? 1 : 0 }}
          flexWrap="wrap"
          useFlexGap
        >
          <Stack direction="row" spacing={0.5} flexShrink={0}>
            <Button size="small" variant="outlined" onClick={() => goToNode('root')} disabled={selectedNodeId === 'root'}>
              <SkipPreviousIcon fontSize="small" />
            </Button>
            <Button size="small" variant="outlined" onClick={goPrev} disabled={selectedNodeId === 'root'}>
              <NavigateBeforeIcon fontSize="small" />
            </Button>
            <Button size="small" variant="outlined" onClick={goNext} disabled={!canGoNext}>
              <NavigateNextIcon fontSize="small" />
            </Button>
            <Button
              size="small"
              variant="outlined"
              onClick={() => {
                const ids = mainLineNodeIds;
                if (ids.length) goToNode(ids[ids.length - 1]);
              }}
              disabled={!hasMoves}
            >
              <SkipNextIcon fontSize="small" />
            </Button>
          </Stack>

          <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>
            {t('analysis.turn')}: {turn === 'w' ? t('analysis.white') : t('analysis.black')}
          </Typography>

          <Box
            sx={{
              flex: 1,
              minWidth: { xs: '100%', lg: 160 },
              bgcolor: 'action.hover',
              px: 1,
              py: 0.5,
              borderRadius: 1,
              fontFamily: 'monospace',
              fontSize: { xs: 10, sm: 11 },
              wordBreak: 'break-all',
              lineHeight: 1.3,
            }}
          >
            {boardFen}
          </Box>

          <Stack direction="row" spacing={0.5} flexWrap="wrap" useFlexGap sx={{ flexShrink: 0 }}>
            <Button variant="outlined" size="small" startIcon={<CommentIcon />} onClick={handleOpenCommentEditor} disabled={!canComment}>
              {t('analysis.comment')}
            </Button>
            <Button variant="outlined" size="small" startIcon={<UploadFileIcon />} onClick={() => setUploaderOpen(true)}>
              {t('analysis.loadPgn')}
            </Button>
            <Button variant="contained" size="small" startIcon={<SaveIcon />} onClick={handleSave} disabled={!canSave || saving}>
              {t('analysis.save')}
            </Button>
          </Stack>
        </Stack>

        <Collapse in={commentEditorOpen}>
          <Stack spacing={1} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              multiline
              minRows={2}
              size="small"
              placeholder={t('analysis.commentPlaceholder')}
              value={commentDraft}
              onChange={(e) => setCommentDraft(e.target.value)}
            />
            <Stack direction="row" spacing={1}>
              <Button variant="contained" size="small" onClick={handleSaveComment}>
                {t('analysis.saveComment')}
              </Button>
              <Button variant="text" size="small" onClick={() => setCommentEditorOpen(false)}>
                {t('analysis.cancelComment')}
              </Button>
            </Stack>
          </Stack>
        </Collapse>

        {!hasMoves && (
          <Alert severity="info" sx={{ mt: 1, py: 0.5 }}>
            {t('analysis.playOnBoardHint')}
          </Alert>
        )}
      </Paper>

      <PgnUploader open={uploaderOpen} onClose={() => setUploaderOpen(false)} onSubmit={handlePgnSubmit} />
    </Box>
  );
};
