/**
 * 合并多个CSS模块对象
 * 当有同名类时，后面的会覆盖前面的值
 *
 * @param styleModules - 要合并的样式模块对象
 * @returns 合并后的样式对象
 *
 * @example
 * const styles = mergeStyles(
 *   { btn: 'button', header: 'header' },
 *   { btn: 'primary', footer: 'footer' }
 * );
 * // 结果: { btn: 'primary', header: 'header', footer: 'footer' }
 */
export function mergeStyles(...styleModules: Record<string, string>[]) {
  return styleModules.reduce(
    (merged, module) => ({ ...merged, ...module }),
    {}
  );
}
