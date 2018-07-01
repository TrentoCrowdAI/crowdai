/**
 * Tiny helper to use that returns a comparator that you can pass to the Array.sort method.
 *
 * @param {Function} selector
 * @return {Function}
 */
exports.ascendingComparator = (selector = e => e) => (a, b) => {
  const valA = selector(a);
  const valB = selector(b);
  return valA < valB ? -1 : valA > valB ? 1 : valA >= valB ? 0 : NaN;
};
