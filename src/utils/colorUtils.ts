/**
 * 功能：颜色处理核心算法工具类
 * 作者：FullStack-Guardian
 * 更新时间：2025-12-31
 */
import { colord, extend } from 'colord';
import mixPlugin from 'colord/plugins/mix';

extend([mixPlugin]);

/**
 * 混合两种颜色
 * @param color1 颜色1 (HEX)
 * @param color2 颜色2 (HEX)
 * @param ratio 比例 (0-1)
 */
export const mixColors = (color1: string, color2: string, ratio: number = 0.5): string => {
  return colord(color1).mix(color2, ratio).toHex();
};

/**
 * 获取互补色 (相反颜色)
 */
export const getInvertedColor = (color: string): string => {
  return colord(color).invert().toHex();
};

/**
 * 获取灰度值
 */
export const getGrayscale = (color: string): string => {
  return colord(color).grayscale().toHex();
};
