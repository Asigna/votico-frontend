const generateColorComponent = (base: number): number => (base * 123 + 59) % 256;

const getColorFromLetter = (letter: string): string => {
  if (!letter || letter.length === 0) {
    return 'rgb(0, 0, 0)';
  }

  const code = letter.charCodeAt(0);

  const r = generateColorComponent(code);
  const g = generateColorComponent(r);
  const b = generateColorComponent(g);

  return `rgb(${r}, ${g}, ${b})`;
};

export default getColorFromLetter;
