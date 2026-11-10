// Dates and offer reused from the seasonal sites' TradingView record, checked
// November 10, 2026 against TradingView's November 9 partner announcement.
// All boundaries are Pacific Standard Time; the end is exclusive.
export const promotion = {
  path: '/tradingview-black-friday-2026',
  url: 'https://www.tradingview.com/black-friday/',
  pricingUrl: 'https://www.tradingview.com/pricing/',
  startsAt: '2026-11-23T00:00:00-08:00',
  cyberMondayAt: '2026-11-28T00:00:00-08:00',
  endsAt: '2026-12-02T00:00:00-08:00',
  checkedOn: '2026-11-10',
  affiliate: false,
} as const;

export function promotionState(now = new Date()) {
  const time = now.getTime();
  if (!Number.isFinite(time)) throw new RangeError('Invalid promotion date');
  if (time < Date.parse(promotion.startsAt)) return 'upcoming';
  if (time < Date.parse(promotion.cyberMondayAt)) return 'black-friday';
  if (time < Date.parse(promotion.endsAt)) return 'cyber-monday';
  return 'expired';
}

export function promotionCopy(now = new Date()) {
  const state = promotionState(now);
  const expired = state === 'expired';
  return {
    state,
    label: state === 'upcoming' ? 'Upcoming · begins November 23' : expired ? '2026 promotion ended' : state === 'black-friday' ? 'Black Friday · announced campaign window' : 'Cyber Monday · announced campaign window',
    title: expired ? 'The 2026 TradingView promotion has ended.' : 'TradingView Black Friday & Cyber Monday 2026',
    summary: expired
      ? 'The announced November 23–December 1, 2026 campaign has ended. Check TradingView for current plans and pricing.'
      : 'Announced offer: up to 80% off eligible annual plans, plus one additional month. Individual plan prices and actual discounts must be checked at TradingView.',
    timing: state === 'upcoming'
      ? 'Begins November 23, 2026 at 12:00 a.m. Pacific Time. This is an upcoming promotion, not an active discount.'
      : expired ? 'Ended December 1, 2026 at 11:59:59 p.m. Pacific Time.'
      : 'Within the announced campaign dates. Confirm the offer is available for your account at TradingView before paying.',
    cta: state === 'upcoming' ? 'Preview the official offer' : expired ? 'Check current TradingView plans' : 'Check the offer at TradingView',
    href: expired ? promotion.pricingUrl : promotion.url,
  };
}

// Server-rendered pages stay correct without JS. Refresh open/restored tabs at
// a boundary too; use elapsed time from the server, not the visitor's timezone.
export function boundaryRefresh(now = new Date()) {
  const next = [promotion.startsAt, promotion.cyberMondayAt, promotion.endsAt]
    .map(Date.parse).find(time => time > now.getTime());
  if (!next) return '';
  const delay = Math.min(next - now.getTime() + 100, 2_147_000_000);
  return `<script>(()=>{const due=performance.now()+${delay},wallDue=Date.now()+${delay};const refresh=()=>location.reload();const check=()=>{if(performance.now()>=due||Date.now()>=wallDue)refresh()};setTimeout(refresh,${delay});addEventListener('pageshow',e=>{if(e.persisted)refresh()});document.addEventListener('visibilitychange',()=>{if(!document.hidden)check()});})();</script>`;
}

export function promotionCard(now = new Date()) {
  const copy = promotionCopy(now);
  if (copy.state === 'expired') return '';
  return `<aside class="tv-promo" aria-labelledby="tv-promo-title"><div><p class="tv-kicker">${copy.label}</p><h2 id="tv-promo-title">A charting plan worth comparing.</h2><p>TradingView has announced up to 80% off eligible annual plans, plus one additional month.</p><p class="tv-small">November 23–December 1, 2026 · Pacific Time. Check individual prices and eligibility at TradingView.</p></div><a class="tv-button" href="${promotion.path}">Explore the offer &amp; plan guide <span aria-hidden="true">→</span></a></aside>`;
}
