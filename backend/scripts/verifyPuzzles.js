const { Chess } = require('chess.js');

const puzzles = [
  { name: 'mate', fen: '7k/6p1/6Q1/8/8/8/8/6K1 w - - 0 1', sol: 'Qf8#' },
  { name: 'fork', fen: '4k3/4q3/8/4N3/8/8/8/4K3 w - - 0 1', sol: 'Ne7+' },
  { name: 'scholar', fen: 'r1bqkb1r/pppp1ppp/2n2n2/4p2Q/2B1P3/8/PPPP1PPP/RNB1K2R w KQkq - 4 4', sol: 'Qxf7#' },
  { name: 'bishop', fen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p3/2B1P3/5N2/PPPP1PPP/RNBQK2R w KQkq - 4 4', sol: 'Bxf7+' },
  { name: 'pawn', fen: '8/4k3/8/3P4/8/8/8/4K3 w - - 0 1', sol: 'd6' },
];

for (const p of puzzles) {
  try {
    const c = new Chess(p.fen);
    console.log(p.name, 'load ok', c.fen());
    const m = c.move(p.sol);
    console.log(p.name, m ? 'move ok ' + m.san : 'move fail', c.fen());
  } catch (e) {
    console.log(p.name, 'error', e.message);
  }
}
