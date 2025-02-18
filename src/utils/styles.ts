export function mergeStyles(...styleModules: Record<string, string>[]) {
  return styleModules.reduce(
    (merged, module) => ({ ...merged, ...module }),
    {}
  );
}
