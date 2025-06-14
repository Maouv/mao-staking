# MON Staking DApp

Aplikasi Web3 untuk staking token MON di Monad testnet dengan reward MAOUSLD.

## Setup untuk Development

```bash
npm install
npm run dev
```

## Deploy ke Vercel

1. Push code ke GitHub
2. Import project ke Vercel
3. Set build command: `vite build`
4. Set output directory: `dist/public`
5. Deploy

## Contract Addresses

- Staking Contract: `0xbf20cc14264f15ce43d077c533992b5226feb807`
- MAOUSLD Token: `0x46148378a6Eb3D879F051398Cb2d4e428e991C3C`

## Network Configuration

- Chain ID: 1774 (0x6EE)
- RPC URL: https://testnet1.monad.xyz
- Explorer: https://testnet1.monadhq.com

## Troubleshooting

### Tombol Stake Tidak Bisa Diklik
1. Pastikan wallet sudah terhubung
2. Pastikan sudah sign message untuk authentication
3. Pastikan terhubung ke Monad testnet
4. Pastikan ada saldo MON yang cukup

### Deployment Issues
- Gunakan static build dengan `vite build`
- Pastikan `vercel.json` menggunakan konfigurasi yang benar
- Jangan deploy server code ke Vercel (hanya frontend)