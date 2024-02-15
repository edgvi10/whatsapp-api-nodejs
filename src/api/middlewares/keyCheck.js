function keyVerification(req, res, next) {
    const { query, body, params } = req;
    const key = (query.key || body.key || params.key).toString();
    if (!key) return res.status(403).json({ error: true, message: "no key query was present" });

    const instance = WhatsAppInstances[key];
    if (!instance) return res.status(403).send({ error: true, message: "invalid key supplied" });

    next();
}

module.exports = keyVerification;
