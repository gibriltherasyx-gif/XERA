const {
    sweepExpiredSubscriptions,
} = require("../../server/monetization-server");

module.exports = async (req, res) => {
    const secret = process.env.CRON_SECRET;
    if (secret) {
        const auth = String(req.headers.authorization || "");
        const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
        const querySecret = req.query?.secret;
        if (token !== secret && querySecret !== secret) {
            return res.status(401).json({ error: "Unauthorized" });
        }
    }

    try {
        await sweepExpiredSubscriptions();
        return res.json({ success: true });
    } catch (error) {
        console.error("Cron sweep error:", error);
        return res.status(500).json({ error: "Sweep failed" });
    }
};
