import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Global market
    const globalRes = await fetch('https://api.coingecko.com/api/v3/global')
    const globalData = await globalRes.json()

    // Top 8 coins
    const coinsRes = await fetch(
      'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=8&page=1&price_change_percentage=24h'
    )
    const coinsData = await coinsRes.json()


    const ratesRes = await fetch('https://api.coingecko.com/api/v3/exchange_rates')
    const ratesData = await ratesRes.json()
    const usdToIdr = ratesData.rates.idr.value

    res.status(200).json({ global: globalData.data, coins: coinsData, usdToIdr })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to fetch data from CoinGecko' })
  }
}
