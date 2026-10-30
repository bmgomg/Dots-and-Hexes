// The robot thinks here, off the main thread, so the line just drawn keeps animating while it does (killer's
// endgame solve takes up to a third of a second).
import { chooseMove } from './ai';
import { boardOf } from './engine';

onmessage = ({ data: { id, size, drawn, level } }) => postMessage({ id, move: chooseMove(boardOf(size), drawn, level) });
