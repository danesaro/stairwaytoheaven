const ngrok = require("@ngrok/ngrok");
(async function() {
  const url = await ngrok.connect({ addr: 8080, authtoken_from_env: true });
  console.log(`Ingress established at: ${url}`);
})();