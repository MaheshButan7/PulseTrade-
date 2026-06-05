
async function generatePortfolioSummary(balance, totalValue, holdings, transactions) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured. Please add it to backend/.env to enable AI insights."
    );
  }

  // Lazy-load the AI SDK modules inside the function, not at the top of the file.
  // This means if these modules fail to load, only the AI endpoint fails — not the whole server.
  const { generateText } = require('ai');
  const { createGoogleGenerativeAI } = require('@ai-sdk/google');

  const google = createGoogleGenerativeAI({ apiKey });

  const holdingsStr =
    holdings.length > 0
      ? holdings
          .map(
            (h) =>
              `- ${h.symbol}: Qty: ${h.quantity}, Avg Buy: $${h.avgPrice.toFixed(2)}, Current: $${h.currentPrice.toFixed(2)}, Value: $${h.value.toFixed(2)}`
          )
          .join('\n')
      : 'None (100% Cash)';

  const txStr =
    transactions.length > 0
      ? transactions
          .slice(0, 10)
          .map(
            (t) =>
              `- ${new Date(t.timestamp).toLocaleDateString()}: ${t.type} ${t.quantity} ${t.symbol} @ $${t.price.toFixed(2)}`
          )
          .join('\n')
      : 'No transactions yet';

  const prompt = `You are a helpful and professional AI Portfolio Analyst for the "Pulse Trade" crypto paper-trading app.
Analyze the user's portfolio and provide a clear, plain-English summary.

Portfolio data:
- Cash Balance: $${balance.toFixed(2)}
- Total Portfolio Value: $${totalValue.toFixed(2)}
- Holdings:
${holdingsStr}
- Recent Transactions (last 10):
${txStr}

Format your response in clean markdown with:
1. **📊 Current Allocation**: Breakdown of allocation percentages (e.g. 70% BTC, 30% Cash).
2. **💡 Insights & Recommendations**: 2-3 specific, actionable tips based on their concentration, cash levels, or P&L. Be friendly and encouraging. Use emojis.

Keep the entire response under 200 words. Avoid complex financial jargon.`;

  try {
    const { text } = await generateText({
      model: google('gemini-2.5-flash'),
      prompt,
    });
    return text;
  } catch (error) {
    console.error('Gemini AI API call failed:', error.message);
    throw new Error(`AI analysis failed: ${error.message}`);
  }
}

module.exports = { generatePortfolioSummary };
