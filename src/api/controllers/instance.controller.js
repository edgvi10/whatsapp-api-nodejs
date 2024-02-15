const { WhatsAppInstance } = require("../class/instance")
const fs = require("fs")
const path = require("path")
const config = require("../../config/config")
const { Session } = require("../class/session")

exports.init = async (req, res) => {

    const payload = {};
    payload.key = req.query.key || req.body.key;

    console.log("Payload", payload);
    console.log("WhatsAppInstances", WhatsAppInstances);

    if (payload.key && WhatsAppInstances[payload.key]) {
        return res.json({
            error: false,
            message: "Instance already exists",
            key: payload.key,
            qrcode: {
                url: config.appUrl + "/instance/qr?key=" + payload.key,
            },
            browser: config.browser,
        });
    }

    payload.webhook = req.query.webhook || req.body.webhook;
    payload.webhookUrl = req.query.webhookUrl || req.body.webhookUrl;

    payload.browser = config.browser;
    payload.appUrl = config.appUrl || req.protocol + "://" + req.headers.host;

    const key = payload.key;
    const webhook = (payload.webhook === "true");
    const webhookUrl = payload.webhookUrl || config.webhookUrl;
    const appUrl = payload.appUrl;

    const instance = new WhatsAppInstance(key, webhook, webhookUrl);

    const data = await instance.init();

    WhatsAppInstances[data.key] = instance;
    res.json({
        error: false,
        message: "Initializing successfully",
        key: data.key,
        webhook: {
            enabled: webhook,
            webhookUrl: webhookUrl,
        },
        qrcode: {
            url: appUrl + "/instance/qr?key=" + data.key,
        },
        browser: config.browser,
    });
}

exports.qr = async (req, res) => {
    try {
        const qrcode = await WhatsAppInstances[req.query.key]?.instance.qr;
        res.render("qrcode", {
            qrcode: qrcode,
        });
    } catch {
        res.json({
            qrcode: "",
        });
    }
}

exports.qrbase64 = async (req, res) => {
    try {
        const qrcode = await WhatsAppInstances[req.query.key]?.instance.qr
        res.json({
            error: false,
            message: "QR Base64 fetched successfully",
            qrcode: qrcode,
        });
    } catch {
        res.json({
            qrcode: "",
        });
    }
}

exports.info = async (req, res) => {
    const instance = WhatsAppInstances[req.query.key];
    let data;
    try {
        data = await instance.getInstanceDetail(req.query.key);
        // data.key = instance.instance
    } catch (error) {
        data = {};
    }

    return res.json({
        error: false,
        message: "Instance fetched successfully",
        instance_data: data,
    });
}

exports.restore = async (req, res, next) => {
    try {
        const session = new Session();
        let restoredSessions = await session.restoreSessions();
        return res.json({
            error: false,
            message: "All instances restored",
            data: restoredSessions,
        });
    } catch (error) {
        next(error);
    }
}

exports.logout = async (req, res) => {
    let errormsg
    try {
        await WhatsAppInstances[req.query.key].instance?.sock?.logout()
    } catch (error) {
        errormsg = error
    }
    return res.json({
        error: false,
        message: "logout successfull",
        errormsg: errormsg ? errormsg : null,
    })
}

exports.delete = async (req, res) => {
    let errormsg
    try {
        await WhatsAppInstances[req.query.key].deleteInstance(req.query.key)
        delete WhatsAppInstances[req.query.key]
    } catch (error) {
        errormsg = error
    }
    return res.json({
        error: false,
        message: "Instance deleted successfully",
        data: errormsg ? errormsg : null,
    })
}

exports.list = async (req, res) => {
    if (req.query.active) {
        let instance = []
        const db = mongoClient.db("whatsapp-api")
        const result = await db.listCollections().toArray()
        result.forEach((collection) => {
            instance.push(collection.name)
        })

        return res.json({
            error: false,
            message: "All active instance",
            data: instance,
        })
    }

    let instance = Object.keys(WhatsAppInstances).map(async (key) =>
        WhatsAppInstances[key].getInstanceDetail(key)
    )
    let data = await Promise.all(instance)

    return res.json({
        error: false,
        message: "All instance listed",
        data: data,
    })
}
