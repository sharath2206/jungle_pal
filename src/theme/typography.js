// Typography scale based on Rubik and Nunito Sans from Stitch Design System
const baseTypography = {
  displayHero: {
    fontFamily: 'Rubik, Nunito Sans, sans-serif',
    fontSize: 48,
    lineHeight: 56,
    fontWeight: '800',
  },
  displayHeroMobile: {
    fontFamily: 'Rubik, Nunito Sans, sans-serif',
    fontSize: 36,
    lineHeight: 44,
    fontWeight: '800',
  },
  headlineLg: {
    fontFamily: 'Rubik, Nunito Sans, sans-serif',
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '800',
  },
  headlineLgMobile: {
    fontFamily: 'Rubik, Nunito Sans, sans-serif',
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '800',
  },
  headlineMd: {
    fontFamily: 'Rubik, Nunito Sans, sans-serif',
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '700',
  },
  headlineSm: {
    fontFamily: 'Rubik, Nunito Sans, sans-serif',
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '700',
  },
  bodyLg: {
    fontFamily: 'Nunito Sans, Rubik, sans-serif',
    fontSize: 20,
    lineHeight: 28,
    fontWeight: '700',
  },
  bodyMd: {
    fontFamily: 'Nunito Sans, Rubik, sans-serif',
    fontSize: 18,
    lineHeight: 26,
    fontWeight: '600',
  },
  bodySm: {
    fontFamily: 'Nunito Sans, Rubik, sans-serif',
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '600',
  },
  labelLg: {
    fontFamily: 'Rubik, Nunito Sans, sans-serif',
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '800',
  },
  labelMd: {
    fontFamily: 'Rubik, Nunito Sans, sans-serif',
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '700',
  },
  labelSm: {
    fontFamily: 'Rubik, Nunito Sans, sans-serif',
    fontSize: 13,
    lineHeight: 16,
    fontWeight: '700',
  },
};

// Safe fallback proxy to prevent any undefined property runtime errors
const defaultFallback = {
  fontFamily: 'Rubik, Nunito Sans, sans-serif',
  fontSize: 16,
  lineHeight: 22,
  fontWeight: '700',
};

export const typography = new Proxy(baseTypography, {
  get(target, prop) {
    if (prop in target) {
      return target[prop];
    }
    // Also support kebab-case if accessed
    const camelProp = typeof prop === 'string'
      ? prop.replace(/-([a-z])/g, (g) => g[1].toUpperCase())
      : prop;
    if (camelProp in target) {
      return target[camelProp];
    }
    return defaultFallback;
  },
});
