export const APP_STATE = 'BMG • Dots and Hexes V1';
export const DX = 450;
export const DY = 800;
export const PROMPT_START = 'start';
export const PROMPT_PLAY_AGAIN = 'play again?';
export const PROMPT_RESIGN = 'resign – are you sure?';
export const PROMPT_RESET_STATS = 'reset stats – are you sure?';
export const PROMPT_NO = 'never mind';
export const MSG_START_TIP = 'tip: tap a player to make them go first';
export const MSG_SINGLES = 'one line at a time now';
export const LEVELS = ['easy', 'medium', 'hard', 'killer'];
// what the player sees; the ids above stay as stored in saved modes
export const LEVEL_NAMES = { easy: 'easy', medium: 'not easy', hard: 'even harder', killer: 'really hard' };
export const ROBOT = 'robot';
export const HUMAN = 'human';
export const WINNER_DRAW = 3;
// Screen changes: the old screen fades out, then the new one fades in.
export const SCREEN_OUT = { duration: 200 };
export const SCREEN_IN = { duration: 300, delay: 200 };
