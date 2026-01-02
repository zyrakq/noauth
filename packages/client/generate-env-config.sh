#!/bin/sh
# Generate env-config.js from environment variables at container startup

cat <<EOF > /usr/share/nginx/html/env-config.js
window.ENV = Object.freeze({
  WEB_PUSH_PUBKEY: '${WEB_PUSH_PUBKEY:-}',
  NOAUTHD_URL: '${NOAUTHD_URL:-}',
  DOMAIN: '${DOMAIN:-}',
  ADMIN_DOMAIN: '${ADMIN_DOMAIN:-}',
  RELAY: '${RELAY:-wss://relay.nsec.app}',
  NSEC_APP_NPUB: '${NSEC_APP_NPUB:-}',
  ENCLAVE_LAUNCHER_PUBKEYS: '${ENCLAVE_LAUNCHER_PUBKEYS:-3356de61b39647931ce8b2140b2bab837e0810c0ef515bbe92de0248040b8bdd}',
  ENCLAVE_DEBUG: '${ENCLAVE_DEBUG:-}',
  HOSTED: '${HOSTED:-true}'
});
EOF

echo "Generated env-config.js with runtime configuration"
