export function getVisa(income: number, remote: boolean) {
  if (remote && income >= 2500) return 'Digital Nomad Visa'
  if (remote && income >= 2000) return 'Portugal D7 Visa'
  if (!remote && income >= 1500) return 'Residency Visa'
  return 'Not Eligible Yet'
}
