import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import SkipNextIcon from '@mui/icons-material/SkipNext';
import { Chess } from 'chess.js';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { gamesApi } from '../../shared/api/gamesApi';
import { PgnUploader } from './PgnUploader';
import { usePgnParser, type ParsedMove } from '../../features/analysis/model/usePgnParser';
import { Chessboard } from '../../shared/ui/Chessboard/Chessboard';

export const AnalysisPage = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { parsePgn } = usePgnParser();

  const [loading, setLoading] = useState(false);
  const [moves, setMoves] = useState<ParsedMove[]>([]);
  const [headers, setHeaders] = useState<Record<string, string>>({});
  const [startFen, setStartFen] = useState('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1');
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState<Record<number, string>>({});
  const [uploaderOpen, setUploaderOpen] = useState(false);
  const [gamePgn, setGamePgn] = useState('');

  const currentFen = useMemo(() => {
    if (currentMoveIndex < 0 || currentMoveIndex >= moves.length) {
      return startFen;
    }
    return moves[currentMoveIndex].fen;
  }, [currentMoveIndex, moves, startFen]);

  const turn = useMemo(() => {
    try {
      const chess = new Chess(currentFen);
      return chess.turn();
    } catch {
      return 'w';
    }
  }, [currentFen]);

  const loadGameById = useCallback(
    async (id: number) => {
      setLoading(true);

      try {
        const response = await gamesApi.getGameById(id);
        const game = response.data;

        if (!game.pgn) {
          toast.error(t('analysis.noPgn'));
          return;
        }

        const parsed = parsePgn(game.pgn);

        if (!parsed) {
          toast.error(t('analysis.parseError'));
          return;
        }

        setMoves(parsed.moves);
        setHeaders(parsed.headers);
        setStartFen(parsed.startFen);
        setGamePgn(game.pgn);
        setCurrentMoveIndex(-1);
        setComments({});
        setComment('');
      } catch {
        toast.error(t('analysis.loadError'));
      } finally {
        setLoading(false);
      }
    },
    [parsePgn, t]
  );

  useEffect(() => {
    if (gameId && !Number.isNaN(Number(gameId))) {
      loadGameById(Number(gameId));
    }
  }, [gameId, loadGameById]);

  const handlePgnSubmit = (pgn: string) => {
    const parsed = parsePgn(pgn);

    if (!parsed) {
      toast.error(t('analysis.parseError'));
      return;
    }

    setMoves(parsed.moves);
    setHeaders(parsed.headers);
    setStartFen(parsed.startFen);
    setGamePgn(pgn);
    setCurrentMoveIndex(-1);
    setComments({});
    setComment('');
    toast.success(t('analysis.loaded'));
  };

  const handleSave = async () => {
    if (!gamePgn.trim()) {
      toast.warn(t('analysis.noPgn'));
      return;
    }

    try {
      await gamesApi.uploadPgn({
        pgn: gamePgn,
        result: headers['Result'] || undefined,
        datePlayed: headers['Date'] || undefined,
      });
      toast.success(t('analysis.saved'));
    } catch {
      toast.error(t('analysis.saveError'));
    }
  };

  const goToMove = (index: number) => {
    setCurrentMoveIndex(index);
    setComment(index >= 0 ? comments[index] || '' : '');
  };

  const goFirst = () => goToMove(-1);
  const goPrev = () => goToMove(Math.max(-1, currentMoveIndex - 1));
  const goNext = () => goToMove(Math.min(moves.length - 1, currentMoveIndex + 1));
  const goLast = () => {
    if (moves.length > 0) {
      goToMove(moves.length - 1);
    }
  };

  const handleCommentChange = (value: string) => {
    setComment(value);

    if (currentMoveIndex >= 0) {
      setComments((prev) => ({
        ...prev,
        [currentMoveIndex]: value,
      }));
    }
  };

  const formatMoveNumber = (index: number) => {
    const moveNumber = Math.floor(index / 2) + 1;
    return index % 2 === 0 ? `${moveNumber}.` : `${moveNumber}...`;
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 12 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
          {t('analysis.back')}
        </Button>

        <Typography variant="h4" sx={{ flexGrow: 1 }}>
          {t('analysis.title')}
        </Typography>
      </Stack>

      <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3}>
        <Paper sx={{ flex: 1, p: 3 }}>
          {headers['White'] && headers['Black'] && (
            <Stack direction="row" spacing={1} sx={{ mb: 2 }} flexWrap="wrap" useFlexGap>
              <Chip label={`⬜ ${headers['White']}`} size="small" />
              <Chip label={`⬛ ${headers['Black']}`} size="small" />
              {headers['Result'] && <Chip label={headers['Result']} variant="outlined" size="small" />}
              {headers['Date'] && <Chip label={headers['Date']} variant="outlined" size="small" />}
            </Stack>
          )}

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
            <Box sx={{ width: '100%', maxWidth: 560, mx: 'auto' }}>
              <Chessboard position={currentFen} arePiecesDraggable={false} />
            </Box>

            <Box sx={{ flex: 1 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                {t('analysis.position')}
              </Typography>

              <Box
                sx={{
                  bgcolor: 'action.hover',
                  p: 2,
                  borderRadius: 1,
                  fontFamily: 'monospace',
                  fontSize: 14,
                  wordBreak: 'break-all',
                  mb: 2,
                }}
              >
                {currentFen}
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {t('analysis.turn')}: {turn === 'w' ? t('analysis.white') : t('analysis.black')}
              </Typography>

              <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 2 }}>
                <Button size="small" variant="outlined" onClick={goFirst} disabled={currentMoveIndex <= -1}>
                  <SkipPreviousIcon />
                </Button>
                <Button size="small" variant="outlined" onClick={goPrev} disabled={currentMoveIndex <= -1}>
                  <NavigateBeforeIcon />
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={goNext}
                  disabled={moves.length === 0 || currentMoveIndex >= moves.length - 1}
                >
                  <NavigateNextIcon />
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={goLast}
                  disabled={moves.length === 0 || currentMoveIndex >= moves.length - 1}
                >
                  <SkipNextIcon />
                </Button>
              </Stack>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                {t('analysis.comment')}
              </Typography>

              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder={t('analysis.commentPlaceholder')}
                value={comment}
                onChange={(e) => handleCommentChange(e.target.value)}
                disabled={currentMoveIndex < 0}
              />

              <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
                <Button variant="outlined" startIcon={<UploadFileIcon />} onClick={() => setUploaderOpen(true)}>
                  {t('analysis.loadPgn')}
                </Button>

                <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave} disabled={!gamePgn.trim()}>
                  {t('analysis.save')}
                </Button>
              </Stack>
            </Box>
          </Stack>
        </Paper>

        <Paper sx={{ width: { xs: '100%', lg: 340 }, p: 2, maxHeight: 700, overflow: 'auto' }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            {t('analysis.moveList')}
          </Typography>

          {moves.length === 0 ? (
            <Alert severity="info">{t('analysis.noMoves')}</Alert>
          ) : (
            <List dense disablePadding>
              <ListItemButton selected={currentMoveIndex === -1} onClick={() => goToMove(-1)} sx={{ borderRadius: 1 }}>
                <ListItemText
                  primary={t('analysis.startPosition')}
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItemButton>

              {moves.map((moveItem) => (
                <ListItemButton
                  key={moveItem.index}
                  selected={currentMoveIndex === moveItem.index}
                  onClick={() => goToMove(moveItem.index)}
                  sx={{ borderRadius: 1 }}
                >
                  <ListItemText
                    primary={
                      <Box component="span" sx={{ fontFamily: 'monospace' }}>
                        <Box component="span" sx={{ color: 'text.secondary', mr: 0.5 }}>
                          {formatMoveNumber(moveItem.index)}
                        </Box>
                        {moveItem.san}
                      </Box>
                    }
                    secondary={comments[moveItem.index] || undefined}
                    secondaryTypographyProps={{
                      sx: { fontStyle: 'italic', fontSize: 12 },
                    }}
                  />
                  {comments[moveItem.index] && <Chip label="💬" size="small" sx={{ ml: 1 }} />}
                </ListItemButton>
              ))}
            </List>
          )}
        </Paper>
      </Stack>

      <PgnUploader
        open={uploaderOpen}
        onClose={() => setUploaderOpen(false)}
        onSubmit={handlePgnSubmit}
      />
    </Container>
  );
};