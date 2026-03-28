/**
 * 功能：色盲模拟算法（基于 sRGB 的近似变换矩阵，参考 Viénot/Brettel 类方法）
 * 作者：FullStack-Guardian
 * 更新时间：2026-03-03
 */
import { colord } from 'colord';

export type ColorBlindType = 'protanopia' | 'deuteranopia' | 'tritanopia';

/** sRGB 下红色盲 (Protanopia)、绿色盲 (Deuteranopia)、蓝黄色盲 (Tritanopia) 的 3x3 变换矩阵 (RGB 0-1) */
const MATRICES: Record<ColorBlindType, number[][]> = {
  protanopia: [
    [0.567, 0.433, 0],
    [0.558, 0.442, 0],
    [0, 0.242, 0.758],
  ],
  deuteranopia: [
    [0.625, 0.375, 0],
    [0.7, 0.3, 0],
    [0, 0.3, 0.7],
  ],
  tritanopia: [
    [0.95, 0.05, 0],
    [0, 0.433, 0.567],
    [0, 0.475, 0.525],
  ],
};

function applyMatrix(r: number, g: number, b: number, m: number[][]): [number, number, number] {
  const r01 = r / 255;
  const g01 = g / 255;
  const b01 = b / 255;
  const r2 = Math.max(0, Math.min(1, m[0][0] * r01 + m[0][1] * g01 + m[0][2] * b01));
  const g2 = Math.max(0, Math.min(1, m[1][0] * r01 + m[1][1] * g01 + m[1][2] * b01));
  const b2 = Math.max(0, Math.min(1, m[2][0] * r01 + m[2][1] * g01 + m[2][2] * b01));
  return [Math.round(r2 * 255), Math.round(g2 * 255), Math.round(b2 * 255)];
}

/**
 * 对单色进行色盲模拟，返回 Hex
 */
export function simulateColorBlindness(hex: string, type: ColorBlindType): string {
  const c = colord(hex);
  if (!c.isValid()) return hex;
  const { r, g, b } = c.toRgb();
  const [r2, g2, b2] = applyMatrix(r, g, b, MATRICES[type]);
  return colord({ r: r2, g: g2, b: b2 }).toHex();
}

/**
 * 对 RGB (0-255) 进行色盲模拟，返回 [r,g,b]
 */
export function simulateColorBlindnessRgb(
  r: number,
  g: number,
  b: number,
  type: ColorBlindType
): [number, number, number] {
  return applyMatrix(r, g, b, MATRICES[type]);
}

/**
 * 对 ImageData 的 data (Uint8ClampedArray, RGBA) 进行原地或复制后的色盲模拟
 */
export function simulateImageData(
  data: Uint8ClampedArray,
  type: ColorBlindType,
  out?: Uint8ClampedArray
): Uint8ClampedArray {
  const target = out ?? new Uint8ClampedArray(data.length);
  const m = MATRICES[type];
  for (let i = 0; i < data.length; i += 4) {
    const [r2, g2, b2] = applyMatrix(data[i], data[i + 1], data[i + 2], m);
    target[i] = r2;
    target[i + 1] = g2;
    target[i + 2] = b2;
    target[i + 3] = data[i + 3];
  }
  return target;
}
