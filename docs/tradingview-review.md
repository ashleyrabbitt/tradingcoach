# TradingView promotion review — November 10, 2026

Status: implemented in a review branch only. Explicit owner approval is required
before merging to main or publishing. No production deployment was requested.

## Destination and placement

- Proposed canonical URL: https://tradingcoach.site/tradingview-black-friday-2026
- Discovery card immediately after the homepage hero, and at the end of the
  research desk and chart-reading guide.
- Dedicated guide: dates, eligibility checklist, feature selection, manual-price
  savings calculator and a practice routine linked to existing education.
- [Complete pre-launch page copy](tradingview-page-copy.md).
- [Page template and all alternate-state copy](../lib/tradingview-page.ts).

The discovery card says:

> Upcoming · begins November 23
>
> A charting plan worth comparing.
>
> TradingView has announced up to 80% off eligible annual plans, plus one additional month.
>
> November 23–December 1, 2026 · Pacific Time. Check individual prices and eligibility at TradingView.
>
> Explore the offer & plan guide →

The guide hero says:

> TradingView Black Friday & Cyber Monday 2026
>
> Announced: up to 80% off eligible annual plans, plus one additional month.
>
> Begins November 23, 2026 at 12:00 a.m. Pacific Time. This is an upcoming promotion, not an active discount.
>
> Preview the official offer ↗
>
> Direct TradingView link. We do not earn a referral commission from this link. Link disclosure.

## Exact links

| Purpose | Destination |
| --- | --- |
| Pre-launch / campaign primary button; official source | https://www.tradingview.com/black-friday/ |
| Plan features; post-expiration primary button | https://www.tradingview.com/pricing/ |
| Replay documentation | https://www.tradingview.com/support/solutions/43000691889-learn-to-trade-on-historical-data/ |
| Related Black Friday offers | https://blackfridaysales.xyz/specials#trading-research-software |
| Related Cyber Monday offers | https://cybermondaysale.site/sales.html |
| Chart education | https://tradingcoach.site/blog/how-to-read-a-stock-chart |
| Candlestick education | https://tradingcoach.site/candlesticks |
| Research practice | https://tradingcoach.site/research-workshop |
| Simulation | https://tradingcoach.site/market-lab |
| Link disclosure | https://tradingcoach.site/policies#affiliate |

Additional header/footer links lead to the homepage, academy, research desk and
editorial standards. In-page navigation targets `#dates`, `#features`, `#savings`
and `#practice`.

## Source and architecture review

- Base: `68615e9589643edef373f2486633bb5ab7135451` (November 5), which refreshed
  the beginner research guide. Earlier changes fixed robots.txt, added PDF
  downloads and configured Bun Docker hosting. No newer main commit existed
  when this branch was prepared.
- Existing architecture: Bun 1.2.23, a static HTML page map in `server.ts`,
  public assets and Railway Docker deployment. No package dependencies added.
- Existing chart, candlestick, market-lab and research lessons are reused.
  All 50 existing page-map entries remain; only three discovery markers and
  the affiliate disclosure change their content.
- [Black Friday record](https://github.com/ashleyrabbitt/blackfridaysales/blob/main/lib/black-friday-specials.ts)
  and [Cyber Monday record](https://github.com/ashleyrabbitt/cybermondaysale/blob/main/content/promotions.json)
  were read November 10. Shared record ID:
  `tradingview-black-friday-cyber-monday-2026`. Both are unchanged by this branch.
- TradingView's November 9 partner announcement was read in the owner's
  authorized records. It confirms the maximum discount, additional month,
  exact PST phase dates and a generic affiliate-ID placeholder. No private
  email contents, addresses or tracking identifiers are copied into the site.
- The official public promotion page showed a pre-launch countdown when
  checked November 10. It did not verify individual promotional plan prices.
- TradingView's current pricing/features page and Replay Trading documentation
  support the feature overview. No plan-specific limits or dollar prices are
  copied into the page. Eligibility beyond eligible annual plans remains a
  checkout check rather than an invented universal condition.

## Affiliate check

Searched the authorized email accounts for TradingView partner/affiliate
records, the existing repository content and GitHub code for TradingView
`aff_id`. Also read the seasonal promotion records and Cyber Monday affiliate
configuration. No usable, approved unique TradingView identifier was verified.
The November 9 notice uses a placeholder, not an issued personal URL.

All TradingView URLs are direct, without tracking parameters. No commission
attribution, affiliate analytics or sponsored relationship is claimed. The
near-button disclosure and `/policies#affiliate` explicitly say that these
links do not earn a referral commission. Adding an affiliate URL later requires
verification and a matching disclosure change.

## Timing and expiration

| Server time | Label / behavior |
| --- | --- |
| Before November 23, 00:00 PST | Upcoming; “Preview the official offer” |
| November 23, 00:00 PST–November 27, 23:59:59 PST | Black Friday announced campaign window; “Check the offer at TradingView” |
| November 28, 00:00 PST–December 1, 23:59:59 PST | Cyber Monday announced campaign window; same merchant-check button |
| From December 2, 00:00 PST (08:00 UTC) | Discovery cards removed; page title, description, hero and CTA switch to ended/current pricing |

States are calculated on each request using explicit UTC−08:00 boundaries.
There is no date override exposed to visitors. HTML is not cached. Open tabs
refresh at boundaries and when restored from browser cache; elapsed wall and
monotonic time are checked on returning to a tab. No scheduled rebuild is
needed. Historical dates remain clearly labeled in the archive guide.

## Validation

- `bun test`: **22 passed, 0 failed; 137 assertions**. Covers exact millisecond
  boundaries, all states, expiry of all entry cards, metadata/CTA replacement,
  direct-link/disclosure integrity, empty price inputs, savings math including
  invalid values, sitemap routes, internal links, assets and Docker packaging.
- `bun build server.ts --target=bun --outdir=/tmp/tradingcoach-build`: **passed**.
- Existing-content comparison: **50 page entries preserved**; only the three
  insertions and affiliate disclosure changed.
- Both related seasonal links opened successfully in the connected browser,
  and each displayed its existing upcoming TradingView promotion. The Black
  Friday category anchor resolves to Trading & Research Software.
- Responsive CSS includes 950px, 650px and 360px breakpoints, stacked mobile
  hero/cards, flexible grids, labeled inputs, visible keyboard focus and
  minimum 48px controls. **Visual desktop/mobile browser QA is not complete**:
  the local environment denied browser sockets, and the connected browser
  blocked a data-URL preview. No screenshot or browser interaction success is
  claimed. Savings calculations and route rendering were tested directly.
- No production page verification yet: publication is intentionally awaiting
  explicit owner approval.

## After approval

Recheck main for concurrent changes, merge this exact reviewed branch, inspect
the Railway deployment and verify the live canonical route, homepage card,
mobile layout, calculator, disclosures and all destination links. Confirm the
November 23 pre-launch status if still before launch; use the actual date to
verify the correct subsequent phase otherwise. Do not claim publication until
the production URL displays the reviewed content.
