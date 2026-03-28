/**
 * 功能：色彩工坊工具类单元测试
 * 作者：FullStack-Guardian
 * 更新时间：2025-12-31
 */
import { describe, test, expect } from 'vitest';
import { mixColors, getInvertedColor } from '../src/utils/colorUtils';

describe('Color Utilities', () => {
  test('should mix white and black to gray', () => {
    const result = mixColors('#ffffff', '#000000', 0.5);
    expect(result.toLowerCase()).toBe('#777777');
  });

  test('should invert white to black', () => {
    const result = getInvertedColor('#ffffff');
    expect(result.toLowerCase()).toBe('#000000');
  });

  test('should invert black to white', () => {
    const result = getInvertedColor('#000000');
    expect(result.toLowerCase()).toBe('#ffffff');
  });
});
