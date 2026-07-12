let keep_inv;

ServerEvents.loaded(e => {
    const { server } = e, { persistentData: pData } = server;

    keep_inv = server.gameRules.get("keepInventory");

    Object.keys(global.toggles).forEach(name => {
        global[name] = pData[name] || true
    });

    serverStartup(server);

    global.reloadStartupScript(); /* make sure some global constants are loaded */
    server.runCommandSilent("kjs reload server_scripts");

    const vd = server.playerList.getViewDistance();
    DynamicSetting.CHUNK_TICK_DISTANCE.set(Math.ceil(vd / 3), DynamicManager.getInstance(server))
})