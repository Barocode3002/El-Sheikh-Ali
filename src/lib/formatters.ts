const CURRENCY_FORMATTER = new Intl.NumberFormat("ar-EG", {
  currency: "EGP",
  style: "currency",
  minimumFractionDigits: 0,
})

export function formatCurrency(amount: number) {
  return CURRENCY_FORMATTER.format(amount).replace("ج.م.", "L.E")
}

const NUMBER_FORMATTER = new Intl.NumberFormat("en-US")

export function formatNumber(number: number) {
  return NUMBER_FORMATTER.format(number)
}
