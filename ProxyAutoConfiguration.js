function FindProxyForURL(url, host) {

    // use proxy for specific domains
    if (shExpMatch(host, "johnlewis.scene7.com")) {
        return "PROXY localhost:12013";
    }

    // by default use no proxy
    return "DIRECT";
}
