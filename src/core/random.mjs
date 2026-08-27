export function createRandomSource(random = Math.random) {
  return {
    float: () => random(),
    integer(maximum) {
      if (!Number.isInteger(maximum) || maximum <= 0) return 0;
      return Math.floor(random() * maximum);
    },
    pick(items) {
      return items.length ? items[this.integer(items.length)] : undefined;
    },
    shuffle(items) {
      const result = [...items];
      for (let index = result.length - 1; index > 0; index -= 1) {
        const swapIndex = this.integer(index + 1);
        [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
      }
      return result;
    }
  };
}

export function createSeededRandom(seed = 1) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}
