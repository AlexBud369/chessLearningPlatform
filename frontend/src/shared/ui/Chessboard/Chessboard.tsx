import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { Box, useTheme } from '@mui/material';
import { Chessboard as ReactChessboard } from 'react-chessboard';

interface ChessboardProps {
  position: string;
  orientation?: 'white' | 'black';
  arePiecesDraggable?: boolean;
  onPieceDrop?: (sourceSquare: string, targetSquare: string, piece: string) => boolean;
  compact?: boolean;
  maxWidth?: number;
}

export const Chessboard = ({
  position,
  orientation = 'white',
  arePiecesDraggable = false,
  onPieceDrop,
  compact = false,
  maxWidth,
}: ChessboardProps) => {
  const muiTheme = useTheme();
  const isLight = muiTheme.palette.mode === 'light';
  const containerRef = useRef<HTMLDivElement>(null);
  const onPieceDropRef = useRef(onPieceDrop);
  onPieceDropRef.current = onPieceDrop;
  const boardId = useId().replace(/:/g, '');
  const [boardWidth, setBoardWidth] = useState(compact ? 280 : 400);

  const updateWidth = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const available = container.clientWidth;
    if (available <= 0) return;

    const cap = maxWidth ?? (compact ? 360 : 520);
    const next = Math.floor(Math.min(available, cap));
    setBoardWidth(Math.max(next, 200));
  }, [compact, maxWidth]);

  useEffect(() => {
    updateWidth();
    const container = containerRef.current;
    if (!container) return undefined;

    const observer = new ResizeObserver(updateWidth);
    observer.observe(container);
    return () => observer.disconnect();
  }, [updateWidth]);

  const options = useMemo(
    () => ({
      id: boardId,
      position,
      boardOrientation: orientation,
      allowDragging: arePiecesDraggable,
      allowAutoScroll: false,
      dragActivationDistance: 3,
      showNotation: !compact,
      darkSquareStyle: { backgroundColor: isLight ? '#769656' : '#779556' },
      lightSquareStyle: { backgroundColor: isLight ? '#dce8b8' : '#ebecd0' },
      boardStyle: {
        width: boardWidth,
        height: boardWidth,
        borderRadius: compact ? 0 : 4,
        boxShadow: isLight ? 'inset 0 0 0 1px rgba(0,0,0,0.18)' : undefined,
      },
      onPieceDrop: ({
        sourceSquare,
        targetSquare,
      }: {
        sourceSquare: string;
        targetSquare: string | null;
      }) => {
        if (!targetSquare || !onPieceDropRef.current) return false;
        return onPieceDropRef.current(sourceSquare, targetSquare, '');
      },
    }),
    [boardId, position, orientation, arePiecesDraggable, compact, boardWidth, isLight]
  );

  return (
    <Box
      ref={containerRef}
      sx={{
        width: '100%',
        maxWidth: maxWidth ?? (compact ? 360 : 520),
        mx: 'auto',
        touchAction: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        lineHeight: 0,
        p: isLight ? 0.5 : 0,
        borderRadius: 1,
        bgcolor: isLight ? 'grey.300' : 'transparent',
      }}
    >
      <ReactChessboard options={options} />
    </Box>
  );
};
