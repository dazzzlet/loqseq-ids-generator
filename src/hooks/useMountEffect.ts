import { EffectCallback, useEffect } from "react";

export const useMountEffect = (callback: EffectCallback) => useEffect(callback, []);
