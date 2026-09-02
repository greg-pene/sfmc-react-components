export function calcAspects(width, height) {
  return {
    wAsspect: Number(width) / Number(height),
    hAsspect: Number(height) / Number(width)
  };
}

/**
 * Replaces defaultProps behavior: applies defaults only for undefined props.
 * Unlike object spread, this skips props explicitly passed as undefined,
 * matching the original React defaultProps semantics.
 */
export function applyDefaults(defaults, props) {
  const merged = { ...defaults };
  for (const key in props) {
    if (props[key] !== undefined) {
      merged[key] = props[key];
    }
  }
  return merged;
}
