export function camelToSnake(str: string) {
  return str.replace(/[A-Z]/g, (c) => {
    return `_${c.toLowerCase()}`;
  });
}

export function snakeToCamel(str: string) {
  return str.replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
}
