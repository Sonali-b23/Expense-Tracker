const fs = require('fs');
const path = require('path');

const css = fs.readFileSync(path.join(__dirname, 'App.css'), 'utf8');

const ruleBody = (selectorPattern) => {
  const match = css.match(new RegExp(`${selectorPattern}\\s*{([^}]*)}`));
  return match ? match[1] : '';
};

describe('App.css typography', () => {
  it('sets Times New Roman as the body font', () => {
    expect(ruleBody('(?:^|\\n)body')).toMatch(
      /font-family:\s*'Times New Roman',\s*Times,\s*serif/
    );
  });

  it('does not load the Inter webfont', () => {
    expect(css).not.toMatch(/Inter|fonts\.googleapis\.com/);
  });

  it('makes form controls inherit the body font', () => {
    expect(
      ruleBody('input,\\s*button,\\s*select,\\s*textarea')
    ).toMatch(/font-family:\s*inherit/);
  });
});

describe('App.css colour palette', () => {
  it('contains no legacy purple, green, navy, amber or grey-blue colours', () => {
    expect(css).not.toMatch(
      /#6c5ce7|#00b894|#23243a|#39375b|#ece9f7|#e17055|#2d3436|#636e72|#dfe6e9|#f8f9fa|#f7f8fa|253,\s*203,\s*110|44,\s*62,\s*80/i
    );
  });

  it('only uses hex colours that are red, white or a red tint', () => {
    const hexes = css.match(/#[0-9a-f]{6}\b|#[0-9a-f]{3}\b/gi) || [];
    expect(hexes.length).toBeGreaterThan(0);
    hexes.forEach((hex) => {
      const full =
        hex.length === 4
          ? '#' + hex.slice(1).split('').map((c) => c + c).join('')
          : hex;
      const [r, g, b] = [1, 3, 5].map((i) => parseInt(full.slice(i, i + 2), 16));
      expect(r).toBeGreaterThanOrEqual(g);
      expect(r).toBeGreaterThanOrEqual(b);
      expect(Math.abs(g - b)).toBeLessThanOrEqual(0x30);
    });
  });

  it('defines red accent and danger colours in light and dark themes', () => {
    ['(?:^|\\n):root', 'body\\.dark'].forEach((selector) => {
      const body = ruleBody(selector);
      expect(body).toMatch(/--accent-color:\s*#(?:d3|e5|ef|ff)[0-9a-f]{4}/i);
      expect(body).toMatch(/--danger-color:\s*#(?:c6|ff)[0-9a-f]{4}/i);
    });
  });
});
