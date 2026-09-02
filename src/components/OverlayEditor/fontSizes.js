export default function fontSizes(min = 12, max = 48, steps = 2) {
  let sizes = [];
  while (min <= max) {
    let s = {};
    s.value = min + 'px';
    s.label = min;
    sizes.push(s);
    min = min + steps;
  }
  return sizes;
}
