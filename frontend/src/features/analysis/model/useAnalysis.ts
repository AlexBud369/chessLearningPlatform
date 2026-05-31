import { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../app/store';
import { setNodes, addNode, updateNode, clearNodes, setCurrentFen } from '../../../entities/analysis/model/analysisSlice';
import { analysisApi } from '../../../shared/api/analysisApi';
import { Game } from '../../../shared/types/game';
import { Chess } from 'chess.js';

export const useAnalysis = (gameId?: string) => {
  const dispatch = useDispatch();
  const { nodes, currentFen, loading } = useSelector((state: RootState) => state.analysis);
  const [game, setGame] = useState<Game | null>(null);
  const [chess, setChess] = useState<Chess | null>(null);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [currentMoveIndex, setCurrentMoveIndex] = useState(-1);

  useEffect(() => {
    if (!gameId) return;
    const fetchGame = async () => {
      try {
        const gameData = await analysisApi.getGame(gameId);
        setGame(gameData);
        const chessInstance = new Chess();
        if (gameData.pgn) {
          chessInstance.loadPgn(gameData.pgn);
          const history = chessInstance.history();
          setMoveHistory(history);
          setCurrentMoveIndex(history.length - 1);
          setChess(chessInstance);
          dispatch(setCurrentFen(chessInstance.fen()));
        }
        const analysisNodes = await analysisApi.getNodes(gameId);
        dispatch(setNodes(analysisNodes));
      } catch (error) {
        console.error(error);
      }
    };
    fetchGame();
  }, [gameId, dispatch]);

  const goToMove = useCallback((moveIndex: number) => {
    if (!chess || !game?.pgn) return;
    const tempChess = new Chess();
    tempChess.loadPgn(game.pgn);
    const history = tempChess.history();
    const movesUpTo = history.slice(0, moveIndex + 1);
    const targetChess = new Chess();
    movesUpTo.forEach((m) => targetChess.move(m));
    dispatch(setCurrentFen(targetChess.fen()));
    setCurrentMoveIndex(moveIndex);
  }, [chess, game, dispatch]);

  const addComment = useCallback(async (nodeId: string, comment: string, isTrainer: boolean) => {
    try {
      const updatedNode = await analysisApi.addComment(nodeId, { comment, isTrainerComment: isTrainer });
      dispatch(updateNode(updatedNode));
    } catch (error) {
      console.error(error);
    }
  }, [dispatch]);

  const addVariation = useCallback(async (parentId: string | null, moveSan: string, fen: string) => {
    try {
      const newNode = await analysisApi.createNode({ parentId, moveSan, fen, gameId: gameId! });
      dispatch(addNode(newNode));
    } catch (error) {
      console.error(error);
    }
  }, [gameId, dispatch]);

  const reset = useCallback(() => {
    dispatch(clearNodes());
    dispatch(setCurrentFen('start'));
    setCurrentMoveIndex(-1);
  }, [dispatch]);

  return {
    game,
    nodes,
    currentFen,
    loading,
    moveHistory,
    currentMoveIndex,
    goToMove,
    addComment,
    addVariation,
    reset,
  };
};