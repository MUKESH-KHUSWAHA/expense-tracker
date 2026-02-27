import Expense from "../models/Expense.js";

export const chatWithAi = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        success: false,
        message: "Not authorized",
      });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: "OPENROUTER_API_KEY not configured",
      });
    }

    const { message } = req.body || {};
    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const now = new Date();
    const targetMonth = now.getMonth() + 1;
    const targetYear = now.getFullYear();
    const startOfCurrentMonth = new Date(targetYear, targetMonth - 1, 1);
    const endOfCurrentMonth = new Date(targetYear, targetMonth, 0, 23, 59, 59, 999);

    const expenses = await Expense.find({
      user: req.user._id,
      date: { $gte: startOfCurrentMonth, $lte: endOfCurrentMonth },
    });

    const total = expenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
    const byCategory = expenses.reduce((acc, e) => {
      const cat = e.category || "Uncategorized";
      const amt = Number(e.amount) || 0;
      acc[cat] = (acc[cat] || 0) + amt;
      return acc;
    }, {});

    const summary = `Current month (${targetMonth}/${targetYear}) summary:
Total spent: ${total}
Category breakdown: ${JSON.stringify(byCategory)}
Expense count: ${expenses.length}`;

    const prompt = `You are a helpful financial assistant for an expense tracker.
Use the user's summary to answer the question with practical, concrete advice.

User summary:
${summary}

User question:
${message.trim()}`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a concise, friendly financial assistant. Keep answers short and actionable.",
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.6,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error("[AI] OpenRouter chat error:", data);
      return res.status(200).json({
        success: true,
        reply: "I’m having trouble responding right now. Please try again in a moment.",
      });
    }

    const reply = data?.choices?.[0]?.message?.content;
    return res.status(200).json({
      success: true,
      reply: typeof reply === "string" && reply.trim() ? reply.trim() : "How can I help?",
    });
  } catch (error) {
    console.error("[AI] OpenRouter chat error:", error);
    return res.status(200).json({
      success: true,
      reply: "I’m having trouble responding right now. Please try again later.",
    });
  }
};