# 🇳🇬 taxooor — Nigerian Freelancer Tax Compliance Tool

> **Built for the DevCareer × Raenest Hackathon 2025**

**taxooor** helps Nigerian freelancers and remote workers comply with the new **2026 Nigeria Tax Act (NTA 2025)** while maximizing their earnings through smarter payout strategies with **Raenest**.

---

## 🎯 The Problem

Nigerian freelancers face 3 critical financial challenges in 2026:

1. **Self-declaration is now mandatory** — The new NTA 2025 requires all freelancers earning above ₦800,000/year to file personal income tax with progressive bands up to 25%
2. **Naira volatility destroys earnings** — Converting USD at bad FX rates costs freelancers 3-5% of their income
3. **Slow, expensive payouts** — Traditional bank withdrawals take 2-5 days and come with wire fees and forced conversions

## 💡 The Solution

taxooor is a mobile-first web app that gives freelancers:

- 📊 **Earnings Dashboard** — Track all income across platforms (Upwork, Fiverr, Direct Clients, etc.) in USD & NGN
- 🧮 **Accurate PIT Tax Calculator** — 2026 progressive bands with deductions (rent relief, pension, NHF)
- ⚠️ **Penalty Simulator** — See the real cost of not registering your TIN or filing late
- ⚡ **Raenest vs Traditional Comparator** — Side-by-side savings analysis showing time and money saved
- 📈 **FX Volatility Chart** — Visual proof of why holding USD in Raenest beats immediate conversion
- 🐷 **Tax Pot Savings Tracker** — Set aside 15-25% of earnings toward your tax obligation
- 🎁 **Freelancer Wrapped** — Year-end summary of earnings, tax, and Raenest savings potential
- 📄 **PDF Export** — Download a professional tax report with Raenest recommendation

## 🛠 Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 15** (App Router) | React framework with server components |
| **TypeScript** | Type-safe codebase |
| **Tailwind CSS v4** | Utility-first styling |
| **Recharts** | FX volatility charts |
| **jsPDF** | PDF report generation |
| **Lucide React** | Icon system |
| **localStorage** | Offline-first data persistence |

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Run Locally

```bash
# Clone the repo
git clone https://github.com/Krusherk/taxooor.git
cd taxooor

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Krusherk/taxooor)

Or use the Vercel CLI:

```bash
npx vercel --prod
```

## 📐 2026 NTA Progressive Tax Bands

| Annual Income | Tax Rate |
|---|---|
| Up to ₦800,000 | 0% (Tax-free) |
| ₦800,001 – ₦3,000,000 | 15% |
| ₦3,000,001 – ₦12,000,000 | 18% |
| ₦12,000,001 – ₦25,000,000 | 21% |
| ₦25,000,001 – ₦50,000,000 | 23% |
| Above ₦50,000,000 | 25% |

## 🏗️ Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout with sidebar
│   ├── page.tsx            # Earnings dashboard
│   ├── tax-calculator/     # PIT calculator
│   ├── penalties/          # Penalty simulator
│   ├── compare/            # Raenest vs Traditional
│   ├── fx-chart/           # Naira volatility chart
│   ├── tax-pot/            # Tax savings tracker
│   └── wrapped/            # Freelancer Wrapped
├── components/
│   └── layout/
│       └── sidebar.tsx     # Responsive sidebar navigation
└── lib/
    ├── utils.ts            # Helper utilities
    ├── types.ts            # TypeScript types
    ├── store.ts            # localStorage CRUD
    ├── tax.ts              # Tax calculation engine
    └── pdf.ts              # PDF report generator
```

## 🎨 Design

- **Dark mode** by default — modern fintech aesthetic
- **Nigerian green (#008751) + white** color accents
- **Mobile-first** responsive design
- **Glassmorphism** cards with subtle animations
- **Smooth micro-interactions** for premium feel

## 📝 License

MIT

---

**Built with 🇳🇬 pride for Nigerian freelancers.**
