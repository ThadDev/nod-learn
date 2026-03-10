import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
    console.log("🌱 Seeding database...")

    // Create course
    const course = await prisma.course.upsert({
        where: { id: "course-1" },
        update: {},
        create: {
            id: "course-1",
            title: "Financial Literacy Fundamentals",
            description: "A comprehensive introduction to stocks, blockchain, and real estate investing. Complete the course and earn your certificate.",
            image: null,
            modules: {
                create: [
                    {
                        id: "mod-1",
                        title: "Introduction to Financial Markets",
                        order: 1,
                        lessons: {
                            create: [
                                { id: "les-1", title: "What are financial markets?", order: 1, videoUrl: null, content: "## What Are Financial Markets?\n\nFinancial markets are platforms where buyers and sellers come to exchange assets like stocks, bonds, currencies, and commodities.\n\n## Key Takeaways\n\n- Markets bring together buyers and sellers\n- Prices are set by supply and demand\n- Markets can be physical or digital\n- They enable capital allocation in the economy" },
                                { id: "les-2", title: "Types of markets: Stocks, Bonds, Forex", order: 2, videoUrl: null, content: "## The Major Financial Markets\n\n### Stock Markets\nWhere shares of publicly listed companies are bought and sold.\n\n### Bond Markets\nWhere debt instruments are issued and traded — mostly by governments and corporations.\n\n### Forex Markets\nThe largest market globally, where currencies are exchanged 24/7.\n\n## Why It Matters\n\nUnderstanding each market helps you diversify your investments intelligently." },
                                { id: "les-3", title: "Market participants and their roles", order: 3, videoUrl: null, content: "## Who Participates in Markets?\n\n- **Retail investors**: Individual people like you\n- **Institutional investors**: Banks, pension funds, hedge funds\n- **Market makers**: Ensure liquidity by always being ready to buy or sell\n- **Regulators**: Government bodies that oversee market integrity\n\nEach participant plays a role in keeping markets fair and functional." },
                                { id: "les-4", title: "How market prices are set", order: 4, videoUrl: null, content: "## Price Discovery\n\nPrices in financial markets are set through a process called **price discovery** — the interaction of buyers and sellers.\n\n## Factors That Move Prices\n\n- Earnings reports and company news\n- Economic data (GDP, inflation, unemployment)\n- Central bank decisions on interest rates\n- Geopolitical events and news\n- Investor sentiment\n\nUnderstanding price drivers helps you anticipate market movements." },
                            ],
                        },
                    },
                    {
                        id: "mod-2",
                        title: "Stock Market Fundamentals",
                        order: 2,
                        lessons: {
                            create: [
                                { id: "les-5", title: "What is a stock and why companies issue them", order: 1, videoUrl: null, content: "## Stocks Explained\n\nA stock represents a small ownership stake in a company. When you buy a share, you become a shareholder.\n\n## Why Companies Issue Stock\n\nCompanies list on stock exchanges to raise capital without taking on debt. The process is called an IPO (Initial Public Offering).\n\n## Shareholder Rights\n\n- Partial ownership in the company\n- Potential to receive dividends\n- Voting rights on major decisions\n- Potential capital gain if the stock price rises" },
                                { id: "les-6", title: "Reading stock charts and indicators", order: 2, videoUrl: null, content: "## Understanding Stock Charts\n\nCharts show a stock's price history over time. The most common are:\n\n- **Line charts**: Simple price over time\n- **Candlestick charts**: Show open, close, high, and low for each period\n- **Bar charts**: Similar to candlesticks\n\n## Key Indicators\n\n- **Moving averages** (MA): Average price over a set period\n- **RSI**: Measures whether a stock is overbought or oversold\n- **MACD**: Momentum indicator for trend direction" },
                                { id: "les-7", title: "Fundamental vs. technical analysis", order: 3, videoUrl: null, content: "## Two Schools of Analysis\n\n### Fundamental Analysis\nEvaluates a company's intrinsic value by studying financials, management, and industry position.\n\n**Key metrics**: P/E ratio, revenue growth, profit margins, debt levels\n\n### Technical Analysis\nPredicts future price movements by studying past price patterns and volume.\n\n**Key tools**: Chart patterns, moving averages, RSI, MACD\n\n## Which Should You Use?\n\nMost successful investors use a combination of both approaches." },
                                { id: "les-8", title: "Dividends and portfolio strategies", order: 4, videoUrl: null, content: "## What Are Dividends?\n\nDividends are regular cash payments made to shareholders from a company's profits. Not all companies pay dividends.\n\n## Dividend Strategies\n\n- **Dividend reinvestment**: Automatically buy more shares with dividends\n- **Income investing**: Focus on high-dividend stocks for passive income\n- **Dividend growth investing**: Focus on companies that consistently grow dividends\n\n## Growth vs. Income\n\nYounger investors often prefer growth stocks; income-focused investors prefer dividend stocks." },
                            ],
                        },
                    },
                    {
                        id: "mod-3",
                        title: "Blockchain & Cryptocurrency",
                        order: 3,
                        lessons: {
                            create: [
                                { id: "les-9", title: "How blockchain technology works", order: 1, videoUrl: null, content: "## What Is Blockchain?\n\nA blockchain is a distributed ledger — a database maintained across thousands of computers simultaneously.\n\n## How It Works\n\n1. A transaction is initiated\n2. The transaction is broadcast to a peer-to-peer network\n3. Nodes validate the transaction using algorithms\n4. The verified transaction is combined with others to form a block\n5. The block is added to the existing chain permanently\n\n## Key Properties\n\n- **Decentralised**: No single point of control\n- **Immutable**: Records cannot be altered\n- **Transparent**: All transactions are visible on the public ledger" },
                                { id: "les-10", title: "Bitcoin, Ethereum and altcoins explained", order: 2, videoUrl: null, content: "## Bitcoin (BTC)\n\nThe first and largest cryptocurrency by market cap. Designed as a peer-to-peer digital currency and store of value.\n\n## Ethereum (ETH)\n\nA programmable blockchain that supports smart contracts — the foundation of DeFi and Web3.\n\n## Altcoins\n\nAll cryptocurrencies other than Bitcoin are called altcoins. They vary enormously in purpose and quality.\n\n## Risk Warning\n\nCrypto markets are highly volatile. Never invest more than you can afford to lose." },
                                { id: "les-11", title: "DeFi, NFTs and Web3 basics", order: 3, videoUrl: null, content: "## DeFi: Decentralised Finance\n\nDeFi refers to financial services built on blockchains that operate without traditional banks or intermediaries.\n\n## NFTs: Non-Fungible Tokens\n\nA unique digital asset recorded on a blockchain. Unlike cryptocurrencies, each NFT is one-of-a-kind.\n\n## Web3\n\nThe vision of a decentralised internet where users own their data and digital assets.\n\n## What This Means for Investors\n\nDeFi offers opportunities like lending, staking, and liquidity provision — but also significant risks." },
                                { id: "les-12", title: "Crypto security and safe storage", order: 4, videoUrl: null, content: "## Securing Your Crypto\n\n### Hot Wallets vs. Cold Wallets\n\n- **Hot wallets**: Connected to the internet (convenient but vulnerable)\n- **Cold wallets**: Offline hardware devices (most secure for long-term storage)\n\n### Key Security Practices\n\n- Never share your private key or seed phrase with anyone\n- Use hardware wallets for significant holdings\n- Enable two-factor authentication on exchanges\n- Only use reputable, regulated exchanges\n\n## The Golden Rule\n\nNot your keys, not your coins." },
                            ],
                        },
                    },
                    {
                        id: "mod-4",
                        title: "Real Estate Investing",
                        order: 4,
                        lessons: {
                            create: [
                                { id: "les-13", title: "Property markets 101", order: 1, videoUrl: null, content: "## How Real Estate Markets Work\n\nReal estate markets are local, illiquid, and driven by different factors than stock markets.\n\n## Key Concepts\n\n- **Supply and demand**: Prices rise when demand exceeds housing supply\n- **Location**: The most important factor in real estate value\n- **Interest rates**: Higher rates increase mortgage costs and reduce demand\n- **Economic cycles**: Property markets are cyclical\n\n## Ways to Invest\n\n1. Direct property ownership\n2. REITs (Real Estate Investment Trusts)\n3. Real estate crowdfunding platforms" },
                                { id: "les-14", title: "Understanding REITs", order: 2, videoUrl: null, content: "## What Are REITs?\n\nREITs (Real Estate Investment Trusts) are companies that own income-generating real estate. You can invest in them like stocks.\n\n## Benefits of REITs\n\n- Low minimum investment\n- High liquidity (traded on exchanges)\n- Mandatory 90% profit distribution as dividends\n- Diversified property exposure\n\n## Types of REITs\n\n- Retail REITs (shopping centres)\n- Residential REITs (apartments)\n- Office REITs\n- Industrial REITs (warehouses)\n- Healthcare REITs" },
                                { id: "les-15", title: "Cash flow analysis and ROI", order: 3, videoUrl: null, content: "## Measuring Real Estate Returns\n\n### Gross Rental Yield\n(Annual Rent / Property Price) × 100\n\n### Net Rental Yield\n(Annual Rent - Annual Costs) / Property Price × 100\n\n### Cap Rate\nA measure of the expected return on a commercial property investment, used to compare properties.\n\n### Cash Flow\nMonthly rent minus all expenses (mortgage, maintenance, insurance, management fees)\n\n## The Goal\n\nPositive cash flow means the property makes money each month, even after all expenses." },
                                { id: "les-16", title: "Financing and leverage strategies", order: 4, videoUrl: null, content: "## Using Leverage in Real Estate\n\nMortgages allow investors to control a property worth much more than their initial capital, amplifying returns.\n\n## Example\n\n- Property value: £200,000\n- Down payment: £40,000 (20%)\n- Mortgage: £160,000\n- If property rises 10% → Value = £220,000\n- Return on investment = £20,000 / £40,000 = 50%\n\n## Key Ratios\n\n- **LTV** (Loan-to-Value): Your mortgage as a % of property value\n- **DSCR** (Debt Service Coverage Ratio): Net income / mortgage payment\n\n## Risk Warning\n\nLeverage amplifies losses as well as gains." },
                            ],
                        },
                    },
                    {
                        id: "mod-5",
                        title: "Portfolio Building & Risk Management",
                        order: 5,
                        lessons: {
                            create: [
                                { id: "les-17", title: "Asset allocation basics", order: 1, videoUrl: null, content: "## What Is Asset Allocation?\n\nAsset allocation is how you divide your investments across different asset classes — stocks, bonds, real estate, cash, etc.\n\n## Why It Matters\n\nDifferent assets behave differently in various economic conditions. Proper allocation reduces overall risk.\n\n## Common Allocation Models\n\n- **60/40 Portfolio**: 60% stocks, 40% bonds (classic balanced portfolio)\n- **All-equity**: 100% stocks (higher risk/reward, suitable for long time horizons)\n- **Conservative**: Heavy on bonds and cash (lower risk, for near-retirement)\n\n## Key Principle\n\nYour asset allocation should match your risk tolerance and time horizon." },
                                { id: "les-18", title: "Diversification and correlation", order: 2, videoUrl: null, content: "## What Is Diversification?\n\nDiversification means spreading investments across different assets so that the poor performance of one doesn't devastate your portfolio.\n\n## Correlation\n\nCorrelation measures how assets move relative to each other:\n\n- **+1**: Perfect positive correlation (move together)\n- **0**: No correlation (independent)\n- **-1**: Perfect negative correlation (move opposite)\n\n## Effective Diversification\n\nCombine assets with low or negative correlation to each other for maximum protection.\n\n## Global Diversification\n\nInvesting across different geographies reduces country-specific risk." },
                                { id: "les-19", title: "Risk vs. reward frameworks", order: 3, videoUrl: null, content: "## Understanding Investment Risk\n\n### Types of Risk\n\n- **Market risk**: The entire market falls\n- **Company risk**: One company performs poorly\n- **Liquidity risk**: You can't sell when you want to\n- **Inflation risk**: Returns don't keep pace with inflation\n- **Currency risk**: Foreign investments affected by exchange rates\n\n## Risk-Adjusted Returns\n\nA good investment isn't just about returns — it's about returns relative to the risk taken.\n\n**Sharpe Ratio**: A common measure of risk-adjusted return. Higher = better.\n\n## Your Personal Risk Tolerance\n\nBefore investing, honestly assess how much volatility you can emotionally and financially handle." },
                                { id: "les-20", title: "Building your first portfolio", order: 4, videoUrl: null, content: "## Step-by-Step Portfolio Construction\n\n1. **Define your goals**: What are you investing for and when will you need the money?\n2. **Assess your risk tolerance**: Conservative, moderate, or aggressive?\n3. **Choose your allocation**: Based on goals and risk tolerance\n4. **Select your investments**: Index funds for beginners are ideal\n5. **Set up regular contributions**: Pound/Dollar-cost averaging reduces timing risk\n6. **Review annually**: Rebalance to maintain your target allocation\n\n## Beginner Recommendation\n\nStart with low-cost index funds tracking broad markets (e.g., S&P 500, global all-cap). Add complexity only as your knowledge grows.\n\n## Congratulations!\n\nYou've completed Financial Literacy Fundamentals. Please claim your certificate from your dashboard!" },
                            ],
                        },
                    },
                ],
            },
        },
        include: { modules: { include: { lessons: true } } },
    })

    console.log(`✅ Created course: ${course.title} with ${course.modules.length} modules and ${course.modules.flatMap((m) => m.lessons).length} lessons`)
    console.log("🎉 Seeding complete!")
}

main()
    .catch((e) => { console.error(e); process.exit(1) })
    .finally(() => prisma.$disconnect())
