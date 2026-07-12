import '@testing-library/jest-dom';

// Polyfill WAAPI animate() for jsdom — not implemented by default.
if (typeof HTMLElement !== 'undefined' && !HTMLElement.prototype.animate) {
  HTMLElement.prototype.animate = function () {
    return {
      onfinish: null,
      oncancel: null,
      cancel: () => {},
      pause: () => {},
      play: () => {},
      finish: () => {},
      finished: Promise.resolve({} as Animation),
    } as unknown as Animation;
  };
}

// Polyfill window.matchMedia for jsdom
if (typeof window !== 'undefined' && !window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}
