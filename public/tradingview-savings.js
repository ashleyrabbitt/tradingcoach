// Pure arithmetic shared with tests; this module does not fetch retailer prices.
export function calculateSavings(regular, sale, bonusMonth = false) {
  if (!Number.isFinite(regular) || !Number.isFinite(sale) || regular <= 0 || sale < 0 || regular > 10000000 || sale > 10000000) {
    throw new RangeError('Enter valid prices: a regular annual price above zero and a promotional price of zero or more.');
  }
  const regularCents = Math.round(regular * 100);
  const saleCents = Math.round(sale * 100);
  if (regularCents === 0) throw new RangeError('The regular annual price must be at least 0.01.');
  if (saleCents > regularCents) throw new RangeError('The promotional price is higher than the regular price. Check that both amounts use the same plan, currency and tax basis.');
  const saving = (regularCents - saleCents) / 100;
  return { saving, percent: (regularCents - saleCents) / regularCents * 100, months: bonusMonth ? 13 : 12, monthly: saleCents / 100 / (bonusMonth ? 13 : 12) };
}

if (typeof document !== 'undefined') {
  const form = document.querySelector('#tv-savings-form');
  const output = document.querySelector('#tv-savings-output');
  form?.addEventListener('input', () => { output.textContent = 'Select Calculate my savings to update your comparison.'; });
  form?.addEventListener('submit', event => {
    event.preventDefault();
    try {
      const result = calculateSavings(document.querySelector('#tv-regular').valueAsNumber, document.querySelector('#tv-sale').valueAsNumber, document.querySelector('#tv-bonus').checked);
      output.textContent = `You save ${result.saving.toFixed(2)} (${result.percent.toFixed(1)}%) on the annual price.\nCost spread across ${result.months} months: ${result.monthly.toFixed(2)} per month.\nAmounts use the currency you entered; this is not a monthly payment plan.`;
    } catch (error) { output.textContent = error.message; }
  });
}
