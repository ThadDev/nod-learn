import { prisma } from "@/lib/prisma"

const MAX_ATTEMPTS = 3
const EXAM_DURATION_MINUTES = 35

export class ExamService {
  /**
   * Get the global exam
   */
  static async getGlobalExam() {
    return prisma.exam.findFirst({
      where: { title: "Financial Literacy Certification Exam" },
      include: { questions: { orderBy: { order: "asc" } } },
    })
  }

  /**
   * Check how many exam attempts a user has made
   */
  static async getAttemptCount(userId: string, examId: string): Promise<number> {
    return prisma.examAttempt.count({ where: { userId, examId } })
  }

  /**
   * Get the exam for a given course (DEPRECATED: Use getGlobalExam)
   */
  static async getExamByCourseId(courseId: string) {
    return this.getGlobalExam()
  }

  /**
   * Get or create the global exam (auto-seeds if missing)
   */
  static async getOrCreateExam(slug: string = "global-certification") {
    const existing = await this.getGlobalExam()
    if (existing) return existing

    // Auto-seed the exam if it doesn't exist yet
    const created = await prisma.exam.create({
      data: {
        title: "Financial Literacy Certification Exam",
        duration: 35,
        passScore: 70,
      },
    })

      const questionsData = [
        { q: "What does IPO stand for?", opts: ["Initial Public Offering", "Internal Profit Optimization", "Investment Portfolio Option", "International Price Order"], a: "Initial Public Offering" },
        { q: "A 'share' in a company represents what?", opts: ["Partial ownership", "A guaranteed loan", "A fixed interest rate", "Voting rights only"], a: "Partial ownership" },
        { q: "Which analysis focuses on a company's financial health and intrinsic value?", opts: ["Fundamental Analysis", "Technical Analysis", "Sentimental Analysis", "Predictive Analysis"], a: "Fundamental Analysis" },
        { q: "Candlestick charts are primarily used in which type of analysis?", opts: ["Technical Analysis", "Fundamental Analysis", "Macroeconomic Analysis", "Qualitative Analysis"], a: "Technical Analysis" },
        { q: "What are dividends?", opts: ["Cash payments from profits to shareholders", "Interest on corporate bonds", "Fees paid to brokers", "Taxes on capital gains"], a: "Cash payments from profits to shareholders" },
        { q: "What is the main advantage of a 'distributed ledger' in blockchain?", opts: ["Decentralization and security", "Faster transaction speed", "Lower energy consumption", "Ease of editing historical data"], a: "Decentralization and security" },
        { q: "Who is the pseudonymous creator of Bitcoin?", opts: ["Satoshi Nakamoto", "Vitalik Buterin", "Elon Musk", "Charles Hoskinson"], a: "Satoshi Nakamoto" },
        { q: "What is an NFT?", opts: ["Non-Fungible Token", "New Financial Technology", "Network File Transfer", "National Fund Trust"], a: "Non-Fungible Token" },
        { q: "What is 'Location' in the context of real estate investing?", opts: ["The most important factor in value", "A secondary consideration", "Only relevant for commercial property", "Driven solely by interest rates"], a: "The most important factor in value" },
        { q: "What must a REIT distribute to shareholders to maintain its status?", opts: ["90% of taxable income", "10% of total assets", "50% of revenue", "100% of capital gains"], a: "90% of taxable income" },
        { q: "What does 'LTV' stand for in real estate financing?", opts: ["Loan-to-Value", "Long-Term Ventilation", "Lease-to-Verify", "Location-Time-Velocity"], a: "Loan-to-Value" },
        { q: "Proper asset allocation primarily helps in what?", opts: ["Reducing overall risk", "Guaranteeing high returns", "Eliminating all losses", "Avoiding taxes entirely"], a: "Reducing overall risk" },
        { q: "A portfolio with 60% stocks and 40% bonds is famously known as?", opts: ["60/40 Portfolio", "Aggressive Growth Fund", "Risk-Free Strategy", "Cash-Heavy Model"], a: "60/40 Portfolio" },
        { q: "What measures how two assets move relative to each other?", opts: ["Correlation", "Volatility", "Liquidity", "Inflation"], a: "Correlation" },
        { q: "The 'Sharpe Ratio' measures what?", opts: ["Risk-adjusted return", "Market capitalization", "Dividend yield", "Employee productivity"], a: "Risk-adjusted return" },
        { q: "What is 'Dollar-cost averaging'?", opts: ["Investing fixed amounts at regular intervals", "Only buying when prices are lowest", "Selling when the market crashes", "Exchanging dollars for other currencies"], a: "Investing fixed amounts at regular intervals" },
        { q: "Which of these is considered a 'Cold Wallet'?", opts: ["A hardware device offline", "A mobile app connected to Wi-Fi", "An exchange account", "A browser extension"], a: "A hardware device offline" },
        { q: "What is an 'ETF'?", opts: ["Exchange-Traded Fund", "Electronic Transfer File", "Equity Tax Fixed", "End-of-Term Finance"], a: "Exchange-Traded Fund" },
        { q: "What is the primary role of financial markets in an economy?", opts: ["Capital allocation", "Printing money", "Setting tax rates", "Manufacturing goods"], a: "Capital allocation" },
        { q: "Which market is the largest globally by trading volume?", opts: ["Forex Market", "Stock Market", "Bond Market", "Commodity Market"], a: "Forex Market" },
        { q: "What is a 'bear market'?", opts: ["A period of falling prices", "A period of rising prices", "A market for agricultural goods", "A stable, sideways market"], a: "A period of falling prices" },
        { q: "What is a 'bull market'?", opts: ["A period of rising prices", "A period of falling prices", "A market for precious metals", "A volatile and unpredictable market"], a: "A period of rising prices" },
        { q: "What does ROI stand for?", opts: ["Return on Investment", "Rate of Interest", "Risk of Inflation", "Ready Option Income"], a: "Return on Investment" },
        { q: "What is compound interest?", opts: ["Interest calculated on both principal and accumulated interest", "Interest calculated only on the principal", "Interest paid every day", "Interest that decreases over time"], a: "Interest calculated on both principal and accumulated interest" },
        { q: "What is a 'liquidity' risk?", opts: ["The risk of not being able to sell an asset quickly without a large price drop", "The risk of a company going bankrupt", "The risk of interest rates rising", "The risk of a sudden flood in a bank"], a: "The risk of not being able to sell an asset quickly without a large price drop" },
        { q: "What is 'diversification'?", opts: ["Spreading investments across different asset classes", "Investing everything in one high-growth stock", "Keeping all money in a savings account", "Using multiple brokers for the same trade"], a: "Spreading investments across different asset classes" },
        { q: "What is an 'index fund'?", opts: ["A type of mutual fund or ETF that mimicks a specific market index", "A fund that only invests in tech companies", "A fund managed personally by a billionaire", "A fund that only exists in digital form"], a: "A type of mutual fund or ETF that mimicks a specific market index" },
        { q: "What is 'inflation'?", opts: ["The rate at which the general level of prices for goods and services is rising", "The increase in the value of a currency", "The reduction of a company's debt", "The growth rate of the stock market"], a: "The rate at which the general level of prices for goods and services is rising" },
        { q: "What is a 'bond'?", opts: ["A loan made by an investor to a borrower", "A share of ownership in a company", "A type of insurance policy", "A physical piece of gold"], a: "A loan made by an investor to a borrower" },
        { q: "What is 'equity'?", opts: ["Ownership of assets after liabilities are paid", "A type of short-term loan", "The interest rate on a mortgage", "The total revenue of a company"], a: "Ownership of assets after liabilities are paid" },
        { q: "What is 'market capitalization'?", opts: ["The total value of a company's outstanding shares", "the total assets a company owns", "The amount of cash a company has", "The number of employees a company has"], a: "The total value of a company's outstanding shares" },
        { q: "What is a 'P/E ratio'?", opts: ["Price-to-Earnings ratio", "Profit-to-Expense ratio", "Price-to-Equity ratio", "Payment-to-Effective ratio"], a: "Price-to-Earnings ratio" },
        { q: "What is 'volatility'?", opts: ["The degree of variation in trading prices over time", "The speed of a transaction", "The amount of profit a company makes", "The fixed return on a bond"], a: "The degree of variation in trading prices over time" },
        { q: "What is a 'mutual fund'?", opts: ["An investment program funded by shareholders that trades in diversified holdings", "A fund that only family members can join", "A fund that only invests in physical cash", "A government-run pension scheme"], a: "An investment program funded by shareholders that trades in diversified holdings" },
        { q: "What is 'short selling'?", opts: ["Selling an asset you borrowed with the intent to buy it back at a lower price", "Selling a stock within 5 minutes of buying it", "Selling only 1 share of a company", "Selling at a loss intentionally"], a: "Selling an asset you borrowed with the intent to buy it back at a lower price" },
        { q: "What is a 'blue-chip stock'?", opts: ["A stock from a large, well-established, and financially sound company", "A stock that is worth less than one dollar", "A stock from a gambling company", "A stock that only trades on Tuesdays"], a: "A stock from a large, well-established, and financially sound company" },
        { q: "What is the 'Federal Reserve'?", opts: ["The central banking system of the United States", "A private investment bank", "A military organization", "The US Department of Treasury"], a: "The central banking system of the United States" },
        { q: "What is 'GDP'?", opts: ["Gross Domestic Product", "General Debt Percentage", "Global Deposit Protocol", "Government Development Program"], a: "Gross Domestic Product" },
        { q: "What is 'leverage'?", opts: ["Using borrowed capital to increase potential return", "Trading without any risk", "Reducing the number of employees", "Selling all physical assets"], a: "Using borrowed capital to increase potential return" },
        { q: "What is a 'margin call'?", opts: ["A demand by a broker for an investor to add money to their account to cover potential losses", "A call from a company to its shareholders", "A notification that a stock has reached a new high", "A phone call from the IRS"], a: "A demand by a broker for an investor to add money to their account to cover potential losses" },
        { q: "What is an 'option'?", opts: ["A contract that gives the buyer the right, but not the obligation, to buy or sell an asset", "A choice between two different stocks", "A mandatory trade", "A physical certificate of ownership"], a: "A contract that gives the buyer the right, but not the obligation, to buy or sell an asset" },
        { q: "What is 'arbitrage'?", opts: ["Simultaneous purchase and sale of an asset to profit from a difference in the price", "A long-term investment strategy", "The process of filing for bankruptcy", "Merging two companies"], a: "Simultaneous purchase and sale of an asset to profit from a difference in the price" },
        { q: "What is 'commodity'?", opts: ["A basic good used in commerce that is interchangeable with others of the same type", "A highly specialized tech product", "A luxury service", "An intangible asset like a trademark"], a: "A basic good used in commerce that is interchangeable with others of the same type" },
        { q: "What is 'defensive stock'?", opts: ["A stock that provides consistent dividends and stable earnings regardless of the state of the market", "A stock in a weapons manufacturer", "A stock that investors sell first in a crash", "A stock with high volatility"], a: "A stock that provides consistent dividends and stable earnings regardless of the state of the market" },
        { q: "What is 'fiscal policy'?", opts: ["The use of government spending and taxation to influence the economy", "The control of interest rates by a central bank", "The internal rules of a private corporation", "The pricing strategy of a retail store"], a: "The use of government spending and taxation to influence the economy" },
        { q: "What is 'monetary policy'?", opts: ["Management of the money supply and interest rates by a central bank", "Legislation regarding inheritance tax", "The budgeting process of a household", "The fundraising strategy of a non-profit"], a: "Management of the money supply and interest rates by a central bank" },
        { q: "What is 'fiat money'?", opts: ["Currency that is not backed by a physical commodity like gold", "Money that is shaped like a triangle", "Digital-only currency", "Money that can only be spent on cars"], a: "Currency that is not backed by a physical commodity like gold" },
        { q: "What is a 'recession'?", opts: ["A period of temporary economic decline", "A period of rapid inflation", "The time when a market reaches its all-time high", "A sudden increase in the price of oil"], a: "A period of temporary economic decline" },
        { q: "What is 'stagflation'?", opts: ["Persistent high inflation combined with high unemployment and stagnant demand", "Economic growth with zero inflation", "A sudden drop in the stock market", "When the price of gold stays the same for a year"], a: "Persistent high inflation combined with high unemployment and stagnant demand" },
        { q: "What is 'yield curve'?", opts: ["A line that plots the interest rates of bonds with different maturity dates", "The growth rate of a crop", "The path of a stock's price on a chart", "The total return of a portfolio over time"], a: "A line that plots the interest rates of bonds with different maturity dates" },
        { q: "What is 'capital gain'?", opts: ["A profit from the sale of property or an investment", "The total amount of money in a bank account", "A government grant for small businesses", "The interest earned on a savings account"], a: "A profit from the sale of property or an investment" },
        { q: "What is 'net worth'?", opts: ["Total assets minus total liabilities", "The total amount of cash a person has", "A person's annual salary", "The value of a person's primary residence"], a: "Total assets minus total liabilities" },
        { q: "What is a '401(k)'?", opts: ["An employer-sponsored retirement savings plan in the US", "A high-interest checking account", "A type of life insurance", "A government welfare program"], a: "An employer-sponsored retirement savings plan in the US" },
        { q: "What is an 'IRA'?", opts: ["Individual Retirement Account", "International Revenue Agency", "Internal Risk Analysis", "Investment Ready Asset"], a: "Individual Retirement Account" },
        { q: "What is 'APY'?", opts: ["Annual Percentage Yield", "Average Profit Yearly", "Authorized Payment Yearly", "Account Processing Yield"], a: "Annual Percentage Yield" },
        { q: "What is a 'CD' in banking?", opts: ["Certificate of Deposit", "Cash Disbursement", "Compact Disk", "Credit Debt"], a: "Certificate of Deposit" },
        { q: "What is 'amortization'?", opts: ["The process of gradually paying off a debt over a period of time", "The rapid increase in an asset's value", "Buying assets with pure cash", "A type of tax deduction for artists"], a: "The process of gradually paying off a debt over a period of time" },
        { q: "What is a 'fixed-rate mortgage'?", opts: ["A mortgage where the interest rate stays the same for the entire term", "A mortgage that must be paid in 5 years", "A mortgage with a rate that changes every month", "A mortgage only for house repairs"], a: "A mortgage where the interest rate stays the same for the entire term" },
        { q: "What is an 'ARM' in real estate?", opts: ["Adjustable-Rate Mortgage", "Asset Result Model", "Annual Rental Machine", "Average Rate Method"], a: "Adjustable-Rate Mortgage" },
        { q: "What is 'credit score'?", opts: ["A numerical expression based on a level analysis of a person's credit files", "The amount of money a person can borrow", "The number of credit cards a person owns", "A person's ranking in a video game"], a: "A numerical expression based on a level analysis of a person's credit files" },
        { q: "What is 'bankruptcy'?", opts: ["A legal proceeding involving a person or business that is unable to repay their outstanding debts", "A temporary closure of a bank", "Winning a large sum in a lottery", "Investing in a failed startup"], a: "A legal proceeding involving a person or business that is unable to repay their outstanding debts" },
        { q: "What is 'liquidation'?", opts: ["The process of bringing a business to an end and distributing its assets to claimants", "Turning physical cash into gold", "Increasing the number of shares in a company", "Opening a new bank branch"], a: "The process of bringing a business to an end and distributing its assets to claimants" },
        { q: "What is 'derivative'?", opts: ["A financial security with a value that is reliant upon an underlying asset", "A new type of eco-friendly currency", "A direct investment in land", "A type of tax on high earners"], a: "A financial security with a value that is reliant upon an underlying asset" },
        { q: "What is a 'hedge fund'?", opts: ["A limited partnership of investors that uses high-risk methods to realize large capital gains", "A fund that only invests in environmental projects", "A savings account for farmers", "A fund that guarantees zero losses"], a: "A limited partnership of investors that uses high-risk methods to realize large capital gains" },
        { q: "What is 'insider trading'?", opts: ["The illegal practice of trading on the stock exchange to one's own advantage through having access to confidential information", "Trading only from within a company office", "Buying stocks for family members", "Trading stocks during the weekend"], a: "The illegal practice of trading on the stock exchange to one's own advantage through having access to confidential information" },
        { q: "What is a 'Ponzi scheme'?", opts: ["A form of fraud that lures investors and pays profits to earlier investors with funds from more recent investors", "A legitimate multi-level marketing company", "A type of state-run lottery", "A complex mathematical model for trading"], a: "A form of fraud that lures investors and pays profits to earlier investors with funds from more recent investors" },
        { q: "What is 'money laundering'?", opts: ["The process of making large amounts of money generated by a criminal activity appear to have come from a legitimate source", "Washing physical bills in a machine", "Exchanging old bills for new ones at a bank", "Investing in a professional cleaning service"], a: "The process of making large amounts of money generated by a criminal activity appear to have come from a legitimate source" },
        { q: "What is 'quantitative easing'?", opts: ["The introduction of new money into the money supply by a central bank", "Reducing the number of employees in a bank", "Increasing the difficulty of getting a loan", "A method for teaching math to bankers"], a: "The introduction of new money into the money supply by a central bank" },
        { q: "What is a 'sovereign wealth fund'?", opts: ["A state-owned investment fund", "A fund for royal families only", "A fund that only invests in gold", "A private bank for billionaires"], a: "A state-owned investment fund" },
        { q: "What is 'venture capital'?", opts: ["Capital invested in a project in which there is a substantial element of risk", "Capital used to buy corporate bonds", "Government funding for public works", "Money saved for personal vacations"], a: "Capital invested in a project in which there is a substantial element of risk" },
        { q: "What is 'angel investor'?", opts: ["An individual who provides capital for a business start-up, usually in exchange for convertible debt or ownership equity", "A non-profit organization providing grants", "A person who donates money to churches", "A government official who approves business licenses"], a: "An individual who provides capital for a business start-up, usually in exchange for convertible debt or ownership equity" },
        { q: "What is 'private equity'?", opts: ["Investment funds that buy and restructure companies that are not publicly traded", "Stocks that are owned by the government", "Cash kept in a private safe", "Personal savings of a CEO"], a: "Investment funds that buy and restructure companies that are not publicly traded" },
        { q: "What is a 'hostile takeover'?", opts: ["The acquisition of one company by another that is accomplished by going directly to the company's shareholders or fighting to replace management", "A violent physical occupation of a factory", "Closing a company due to poor sales", "Merging two companies voluntarily"], a: "The acquisition of one company by another that is accomplished by going directly to the company's shareholders or fighting to replace management" },
        { q: "What is 'dividend yield'?", opts: ["A financial ratio that shows how much a company pays out in dividends each year relative to its stock price", "The total amount of dividends paid by all companies in a year", "The percentage of profit a company keeps", "The tax rate on dividend income"], a: "A financial ratio that shows how much a company pays out in dividends each year relative to its stock price" },
        { q: "What is 'earnings per share' (EPS)?", opts: ["The portion of a company's profit allocated to each outstanding share of common stock", "The amount an employee earns for every share they own", "The total revenue divided by the number of shares", "The dividend paid per share"], a: "The portion of a company's profit allocated to each outstanding share of common stock" },
        { q: "What is a 'penny stock'?", opts: ["A common stock that trades for less than $5 per share and has a low market cap", "A stock that is literal physical copper", "A stock belonging to a minting company", "A stock that can only be bought with coins"], a: "A common stock that trades for less than $5 per share and has a low market cap" },
        { q: "What is 'Day Trading'?", opts: ["Buying and selling financial instruments within the same day", "Only trading during daylight hours", "A hobby for retired people", "Investing for at least 10 years"], a: "Buying and selling financial instruments within the same day" },
        { q: "What is 'Swing Trading'?", opts: ["A style of trading that attempts to capture gains in a stock within one to several days", "Trading only when the market is volatile", "Investing in playground equipment manufacturers", "Exchanging stocks between two friends"], a: "A style of trading that attempts to capture gains in a stock within one to several days" },
        { q: "What is 'HODL'?", opts: ["A term used in the crypto community for holding an asset regardless of price volatility", "Head Of Digital Loans", "High Optional Dividend Level", "House Of Digital Ledger"], a: "A term used in the crypto community for holding an asset regardless of price volatility" },
        { q: "What is 'DeFi'?", opts: ["Decentralized Finance", "Digital Equity Fund", "Debt Freedom Initiative", "Direct Electronic Finance"], a: "Decentralized Finance" },
        { q: "What is a 'Stablecoin'?", opts: ["A cryptocurrency designed to have a stable price, usually by being pegged to a fiat currency", "A coin that doesn't change its digital format", "A coin used only for buying horses", "A coin that cannot be sold for 10 years"], a: "A cryptocurrency designed to have a stable price, usually by being pegged to a fiat currency" },
        { q: "What is 'Mining' in crypto?", opts: ["The process by which new cryptocurrency coins are entered into circulation", "Digging for physical bitcoin in the ground", "The process of deleting old transactions", "Searching for lost passwords"], a: "The process by which new cryptocurrency coins are entered into circulation" },
        { q: "What is 'Staking'?", opts: ["Participating in transaction validation on a proof-of-stake blockchain", "Buying a piece of land in a virtual world", "Gambling on the price of a coin", "Deleting your own crypto wallet"], a: "Participating in transaction validation on a proof-of-stake blockchain" },
        { q: "What is a 'Gas Fee'?", opts: ["A fee paid to conduct a transaction on a blockchain network", "The cost of fuel for a mining rig", "A tax on energy consumption", "A fee for storage in a digital wallet"], a: "A fee paid to conduct a transaction on a blockchain network" },
        { q: "What is 'Whale' in crypto?", opts: ["An individual or entity that holds a large amount of a certain cryptocurrency", "A person who lost all their crypto", "A founder of a major exchange", "A hacker who stole crypto"], a: "An individual or entity that holds a large amount of a certain cryptocurrency" },
        { q: "What is 'FUD'?", opts: ["Fear, Uncertainty, and Doubt", "Financial Utility Data", "Fixed Usable Debt", "Fund Under Development"], a: "Fear, Uncertainty, and Doubt" },
        { q: "What is 'FOMO'?", opts: ["Fear Of Missing Out", "Financial Order Marketing Option", "Fixed Output Model Only", "Flexible Operational Market Order"], a: "Fear Of Missing Out" },
        { q: "What is 'Liquidity Pool'?", opts: ["Funds thrown together in a smart contract", "A literal pool of water in a bank", "A collection of silver coins", "A government bailout fund"], a: "Funds together in a smart contract" },
        { q: "What is 'Slippage'?", opts: ["The difference between the expected price of a trade and the price at which the trade is executed", "Losing a physical wallet", "A mistake in a financial report", "A drop in the value of the dollar"], a: "The difference between the expected price of a trade and the price at which the trade is executed" },
        { q: "What is 'Escrow'?", opts: ["A financial arrangement where a third party holds and regulates payment of the funds required for two parties", "A type of high-risk stock", "The lobby of a bank", "A digital currency for house rentals"], a: "A financial arrangement where a third party holds and regulates payment of the funds required for two parties" },
        { q: "What is 'Closing Costs'?", opts: ["Fees paid at the end of a real estate transaction", "The cost of shutting down a business", "The daily fees of a stock exchange", "The price of a house after negotiations"], a: "Fees paid at the end of a real estate transaction" },
        { q: "What is 'Home Equity'?", opts: ["The current market value of a home minus any liens", "The amount of furniture in a house", "The total floor space of a house", "The historical price of a house"], a: "The current market value of a home minus any liens" },
        { q: "What is 'Appraisal' in real estate?", opts: ["An unbiased professional opinion of a home's value", "A celebration of a new house purchase", "A tax on property ownership", "The process of cleaning a house"], a: "An unbiased professional opinion of a home's value" },
        { q: "What is 'Refinancing'?", opts: ["The process of replacing an existing debt obligation with another debt obligation under different terms", "Paying off a loan early with cash", "Taking out a second mortgage", "Selling a house to pay off a loan"], a: "The process of replacing an existing debt obligation with another debt obligation under different terms" },
        { q: "What is 'Foreclosure'?", opts: ["A legal process in which a lender attempts to recover the balance of a loan from a borrower who has stopped making payments", "Putting a new fence around a property", "Increasing the rent of a tenant", "Selling a property at an auction for profit"], a: "A legal process in which a lender attempts to recover the balance of a loan from a borrower who has stopped making payments" },
        { q: "What is 'Capitalization Rate' (Cap Rate)?", opts: ["A real estate valuation measure used to compare different real estate investments", "The total amount of cash in a project", "The tax rate on a commercial building", "The interest rate on a construction loan"], a: "A real estate valuation measure used to compare different real estate investments" },
        { q: "What is 'Property Tax'?", opts: ["A tax paid on property owned by an individual or other legal entity", "A tax on selling a house", "A tax on renting out a room", "A tax on the furniture in a house"], a: "A tax paid on property owned by an individual or other legal entity" },
        { q: "What is a 'Landlord'?", opts: ["A person who rents out land, a building, or accommodation", "A person who sells land", "A government official in charge of land use", "A professional gardener"], a: "A person who rents out land, a building, or accommodation" },
        { q: "What is 'Passive Income'?", opts: ["Earnings derived from a rental property, limited partnership, or other enterprise in which a person is not materially involved", "Income from a full-time job", "Winning the lottery", "Finding money on the street"], a: "Earnings derived from a rental property, limited partnership, or other enterprise in which a person is not materially involved" },
        { q: "What is 'Financial Freedom'?", opts: ["Having enough residual income to pay for your living expenses for the rest of your life without having to work", "Having a credit card with no limit", "Being allowed to trade stocks in any country", "Not having to pay any taxes"], a: "Having enough residual income to pay for your living expenses for the rest of your life without having to work" },
      ]

      await prisma.question.createMany({
        data: questionsData.map((q, i) => ({
          examId: created.id,
          question: q.q,
          options: q.opts,
          correctAnswer: q.a,
          order: i,
        })),
        skipDuplicates: true,
      })

      const fullExam = await prisma.exam.findUnique({
        where: { id: created.id },
        include: { questions: { orderBy: { order: "asc" } } },
      })

      if (!fullExam) throw new Error("Failed to create exam")
      return fullExam
  }

  /**
   * Start a new exam attempt
   */
  static async startAttempt(userId: string, examId: string) {
    const count = await this.getAttemptCount(userId, examId)
    if (count >= MAX_ATTEMPTS) {
      throw new Error(`Maximum of ${MAX_ATTEMPTS} attempts reached.`)
    }
    return prisma.examAttempt.create({
      data: { userId, examId, startedAt: new Date() },
    })
  }

  /**
   * Get questions for an exam, pool of 100, selects 40 random ones.
   */
  static async getQuestionsForExam(examId: string) {
    const questions = await prisma.question.findMany({
      where: { examId },
      select: {
        id: true,
        question: true,
        options: true,
        // correctAnswer intentionally excluded
      },
    })

    // Shuffle and pick 40
    const shuffled = questions.sort(() => Math.random() - 0.5)
    const selection = shuffled.slice(0, 40)

    return selection.map((q) => ({
      ...q,
      options: (q.options as string[]).sort(() => Math.random() - 0.5),
    }))
  }

  /**
   * Submit an exam attempt, grade it, and return the result
   */
  static async submitAttempt(
    attemptId: string,
    answers: { questionId: string; selectedAnswer: string }[]
  ) {
    // Load the attempt with exam details
    const attempt = await prisma.examAttempt.findUnique({
      where: { id: attemptId },
      include: { exam: true },
    })

    if (!attempt) throw new Error("Attempt not found")
    if (attempt.submittedAt) throw new Error("Attempt already submitted")

    // Enforce time limit on server side
    const now = new Date()
    const elapsed = (now.getTime() - attempt.startedAt.getTime()) / 1000 / 60
    const maxDuration = EXAM_DURATION_MINUTES + 1 // 1 minute grace period

    if (elapsed > maxDuration) {
      // Time expired — still grade what was submitted (treat unsubmitted as empty)
    }

    // Fetch correct answers
    const questions = await prisma.question.findMany({
      where: { examId: attempt.examId },
      select: { id: true, correctAnswer: true },
    })

    const answerMap = new Map(answers.map((a) => [a.questionId, a.selectedAnswer]))
    let correct = 0
    for (const q of questions) {
      if (answerMap.get(q.id) === q.correctAnswer) correct++
    }

    const score = questions.length > 0 ? (correct / questions.length) * 100 : 0
    if (!attempt.exam) throw new Error("Exam not found on attempt")
    const passed = score >= attempt.exam.passScore

    // Save answers and update the attempt in a transaction
    await prisma.$transaction([
      prisma.answer.createMany({
        data: answers.map((a) => ({
          attemptId,
          questionId: a.questionId,
          selectedAnswer: a.selectedAnswer,
        })),
        skipDuplicates: true,
      }),
      prisma.examAttempt.update({
        where: { id: attemptId },
        data: { score, passed, submittedAt: now },
      }),
    ])

    return { score, passed, attemptId, examId: attempt.examId }
  }

  /**
   * Get all attempts for a user + exam
   */
  static async getUserAttempts(userId: string, examId: string) {
    return prisma.examAttempt.findMany({
      where: { userId, examId },
      orderBy: { startedAt: "desc" },
    })
  }
}
