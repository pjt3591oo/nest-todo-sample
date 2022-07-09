export const SIDE_EFFECT_TOKEN = "SIDE_EFFECT";

export interface ISideEffect {
  getRandom:() => Promise<number>;
};