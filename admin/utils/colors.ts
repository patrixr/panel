export const PALLETTE = [
  '#fd7e14',
  '#82c91e',
  '#fab005',
  '#40c057',
  '#12b886',
  '#15aabf',
  '#228be6',
  '#be4bdb',
  '#7950f2',
  '#e64980',
  '#fa5252'
];

export const getNextColor = (() => {
  let idx = 0;
  return () : string => PALLETTE[idx++ % PALLETTE.length];
})();
