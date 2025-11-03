export const formatIDR = (value: number): string =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(value)

// Alternatif tanpa simbol Rp
export const formatIDRPlain = (value: number): string =>
  `IDR ${new Intl.NumberFormat("id-ID", {
    maximumFractionDigits: 0
  }).format(value)}`