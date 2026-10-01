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
