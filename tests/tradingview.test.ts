import { describe, expect, test } from 'bun:test';
import { handleRequest } from '../server';
import { boundaryRefresh, promotion, promotionCard, promotionState } from '../lib/tradingview-promotion';
import { tradingViewPage } from '../lib/tradingview-page';
import { calculateSavings } from '../public/tradingview-savings.js';

describe('Pacific campaign boundaries', () => {
  const cases = [
    ['2026-11-10T18:00:00Z', 'upcoming'],
    ['2026-11-23T07:59:59.999Z', 'upcoming'],
    ['2026-11-23T08:00:00Z', 'black-friday'],
    ['2026-11-28T07:59:59.999Z', 'black-friday'],
    ['2026-11-28T08:00:00Z', 'cyber-monday'],
    ['2026-12-02T07:59:59.999Z', 'cyber-monday'],
    ['2026-12-02T08:00:00Z', 'expired'],
    ['2027-11-23T08:00:00Z', 'expired'],
  ];
  for (const [date, state] of cases) test(`${date}: ${state}`, () => expect(promotionState(new Date(date))).toBe(state));
  test('rejects an invalid clock', () => expect(() => promotionState(new Date('invalid'))).toThrow());
  test('open tabs refresh at the next boundary', () => {
    expect(boundaryRefresh(new Date('2026-11-23T07:59:59Z'))).toContain('setTimeout(refresh,1100)');
    expect(boundaryRefresh(new Date('2026-11-28T07:59:59Z'))).toContain('setTimeout(refresh,1100)');
    expect(boundaryRefresh(new Date('2026-12-02T07:59:59Z'))).toContain('setTimeout(refresh,1100)');
    expect(boundaryRefresh(new Date('2026-12-02T08:00:00Z'))).toBe('');
  });
});

describe('rendered promotion and discovery', () => {
  test('pre-launch copy is clearly upcoming, with direct links and no fabricated prices', () => {
    const html = tradingViewPage(new Date('2026-11-10T18:00:00Z'));
    expect(html).toContain('not an active discount');
    expect(html).toContain('up to 80%');
    expect(html).toContain('Preview the official offer');
    expect(html).toContain(`href="${promotion.url}"`);
    expect(html).toContain('We do not earn a referral commission');
    expect(html).not.toMatch(/aff_id|affiliate_id|"@type":"Offer"|Save now|Buy now/);
    expect(html).not.toMatch(/id="tv-(regular|sale)"[^>]*value=/);
    expect(html).toContain('<script type="module" src="/tradingview-savings.js">');
  });
  test('active windows do not claim checkout was verified', () => {
    for (const date of ['2026-11-23T08:00:00Z', '2026-11-28T08:00:00Z']) {
      const html = tradingViewPage(new Date(date));
      expect(html).toContain('announced campaign window');
      expect(html).toContain('Confirm the offer is available for your account');
      expect(html).toContain('Check the offer at TradingView');
      expect(html).not.toContain('not an active discount');
    }
  });
  test('expired page changes title, metadata, hero and main CTA', () => {
    const html = tradingViewPage(new Date(promotion.endsAt));
    expect(html).toContain('<title>The 2026 TradingView promotion has ended.');
    expect(html).toContain('Check current TradingView plans');
    expect(html).toContain(`class="tv-button" href="${promotion.pricingUrl}"`);
    expect(html).not.toContain('tv-offer-number');
    expect(html).not.toContain('Preview the official offer');
    expect(html).not.toContain('announced campaign window');
    expect(promotionCard(new Date(promotion.endsAt))).toBe('');
  });
  test('discovery cards appear on all three entry points, then disappear', async () => {
    for (const path of ['/', '/research', '/blog/how-to-read-a-stock-chart']) {
      const before = handleRequest(new Request('https://tradingcoach.site' + path), new Date(promotion.startsAt));
      const after = handleRequest(new Request('https://tradingcoach.site' + path), new Date(promotion.endsAt));
      expect(before.headers.get('cache-control')).toBe('no-store');
      expect(await before.text()).toContain('href="' + promotion.path + '"');
      expect(await after.text()).not.toContain('class="tv-promo"');
    }
  });
  test('canonical, sitemap, disclosures and HTTP routes work', async () => {
    for (const path of [promotion.path, promotion.path + '/']) {
      const response = handleRequest(new Request('https://tradingcoach.site' + path));
      expect(response.status).toBe(200);
      expect(response.headers.get('cache-control')).toBe('no-store');
      expect(await response.text()).toContain('rel="canonical" href="https://tradingcoach.site' + promotion.path + '"');
    }
    expect(await handleRequest(new Request('https://tradingcoach.site/sitemap.xml')).text()).toContain(promotion.path);
    expect(await handleRequest(new Request('https://tradingcoach.site/policies')).text()).toContain('id="affiliate"');
    expect(handleRequest(new Request('https://tradingcoach.site/not-a-page')).status).toBe(404);
    expect(handleRequest(new Request('https://tradingcoach.site/academy.html')).status).toBe(301);
  });
  test('all internal guide links and assets resolve', async () => {
    const html = tradingViewPage(new Date(promotion.startsAt));
    const paths = new Set([...html.matchAll(/(?:href|src)="(\/[^"#]*)/g)].map(match => match[1]));
    for (const path of paths) {
      const response = handleRequest(new Request('https://tradingcoach.site' + path));
      expect(response.status).toBe(200);
      expect((await response.text()).length).toBeGreaterThan(0);
    }
  });
  test('every existing sitemap page remains reachable', async () => {
    const xml = await handleRequest(new Request('https://tradingcoach.site/sitemap.xml')).text();
    for (const [, url] of xml.matchAll(/<loc>(.*?)<\/loc>/g)) {
      expect(handleRequest(new Request(url)).status).toBe(200);
    }
  });
  test('deployment includes the new server modules', async () => {
    expect(await Bun.file('Dockerfile').text()).toContain('COPY lib ./lib');
  });
});

describe('savings arithmetic', () => {
  test('80% savings with 13 months spreads the payment correctly', () => {
    expect(calculateSavings(500, 100, true)).toEqual({ saving: 400, percent: 80, months: 13, monthly: 100 / 13 });
  });
  test('12 months is the default; equal prices do not invent savings', () => {
    expect(calculateSavings(120, 120)).toEqual({ saving: 0, percent: 0, months: 12, monthly: 10 });
  });
  test('decimal cents and a free price are valid', () => {
    expect(calculateSavings(99.99, 79.99).saving).toBe(20);
    expect(calculateSavings(99.99, 0).percent).toBe(100);
  });
  test('invalid or higher promotional prices fail clearly', () => {
    for (const [a, b] of [[0, 10], [-1, 10], [100, -1], [100, 101], [NaN, 10], [Infinity, 10], [10000001, 10]]) {
      expect(() => calculateSavings(a, b)).toThrow();
    }
  });
});
