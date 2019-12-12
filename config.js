const http = require("http");
const https = require("https");
const { enablehttps, options, gatewayCN } = require("./security-config.js")
const clientUnauthorized = () => res.status(401).send("Cliente no autorizado");

module.exports = {
	database: {
		connectionLimit: "10",
    	host: "",
    	user: "",
    	password: "",
		database: "",
		debug: true
	},
	serverconfig: (app) => {
		if (enablehttps) {
			app.use((req, res, next) => {
			    if (!req.client.authorized) {
			      return clientUnauthorized();
			   	}
			   	const cert = req.socket.getPeerCertificate();
			   	if (!cert.subject || cert.subject.CN !== gatewayCN) {
			   		return clientUnauthorized();
			   	}
				next();
			});
			server = https.createServer(options, app);
		} else {
			server = http.createServer(app);
		}
	}
}