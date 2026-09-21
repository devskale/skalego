// Design-token extractor — run via `rodney js` on the active page.
// Returns a compact JSON blob of the page's visual system.
(() => {
  const els = [...document.querySelectorAll('body *')];
  const css = (e) => getComputedStyle(e);
  const uniq = (arr) => [...new Set(arr)].filter(Boolean);

  // Backgrounds: count distinct bg colors on elements with a solid bg
  const bgCount = {};
  els.forEach((e) => {
    const c = css(e).backgroundColor;
    if (c && c !== 'rgba(0, 0, 0, 0)' && c !== 'transparent') {
      bgCount[c] = (bgCount[c] || 0) + 1;
    }
  });
  const topBg = Object.entries(bgCount).sort((a, b) => b[1] - a[1]).slice(0, 6)
    .map(([c, n]) => `${c} (${n})`);

  const fonts = uniq(els.map((e) => css(e).fontFamily)).slice(0, 6);
  const textColors = uniq(els.map((e) => css(e).color)).slice(0, 8);

  // Radii of the most "card-like" elements (large radius, has border or bg)
  const radii = uniq(els
    .filter((e) => css(e).borderRadius !== '0px')
    .map((e) => css(e).borderRadius))
    .slice(0, 8);

  // Font sizes of headings
  const hSizes = uniq(['h1','h2','h3'].map((sel) => {
    const e = document.querySelector(sel);
    return e ? css(e).fontSize : null;
  }).filter(Boolean));

  // Accent colors: any color used in borders or backgrounds that isn't gray/black/white
  const allColors = new Set();
  els.forEach((e) => {
    ['color','borderTopColor','backgroundColor'].forEach((p) => {
      const v = css(e)[p];
      if (v && !/rgba\(0, 0, 0|#000|#fff|rgb\(0\b|rgb\((25[0-5]), \1, \1|rgb\((2[0-4][0-9]), \2, \2/.test(v)) allColors.add(v);
    });
  });

  // Detect dark vs light
  const bodyBg = css(document.body).backgroundColor;
  const isDark = (() => {
    const m = bodyBg.match(/(\d+), (\d+), (\d+)/);
    if (!m) return null;
    return (Number(m[1]) + Number(m[2]) + Number(m[3])) / 3 < 128;
  })();

  return JSON.stringify({
    theme: isDark === null ? 'unknown' : (isDark ? 'dark' : 'light'),
    bodyBg,
    bodyText: css(document.body).color,
    fonts,
    textColors,
    topBg,
    radii,
    headingSizes: hSizes,
  }, null, 2);
})()
