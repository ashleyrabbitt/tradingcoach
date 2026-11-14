# Trading Coach

Financial literacy education platform. Bun HTTP server with interactive investing lessons, educational articles, fictional paper trading, a market lab and research worksheets.

## Local development

Install Bun and run `bun run server.ts`. The server listens on `PORT` or 8080.

## Deployment

Railway deploys this repository using the supplied Dockerfile. The former Railway Function is retained during migration, so the custom domain can be moved only after confirming the new service is healthy.

**Disclaimer:** Educational simulations only, not financial advice. No real market quotes or trades.

## TradingView holiday guide (2026)

`/tradingview-black-friday-2026` is rendered per request from
`lib/tradingview-page.ts`. The single campaign configuration in
`lib/tradingview-promotion.ts` controls upcoming, Black Friday, Cyber Monday and
expired states. Cards appear on the homepage, research desk and chart-reading
article only before expiration. The final cutoff is December 2 at 00:00 PST
(December 2 at 08:00 UTC), immediately after the announced December 1 end.
HTML is served with `Cache-Control: no-store`; open tabs refresh at phase
boundaries. No scheduled deployment is required. Production uses server time;
there is no query parameter or environment override for campaign dates.

The offer link is direct, with no affiliate identifier or commission tracking.
See [the review record](docs/tradingview-review.md) for sources, exact content,
links, validation and the approval requirement before merge or publication.

```sh
bun test
bun build server.ts --target=bun --outdir=/tmp/tradingcoach-build
```
