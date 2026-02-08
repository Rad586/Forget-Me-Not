let entity_drop, keep_inv, trade;
ServerEvents.loaded(e => {
    const {server} = e, {persistentData: pData} = server;

    keep_inv = server.gameRules.get("keepInventory");
    entity_drop = pData.entity_drop || false;
    trade = pData.trade || false;
    global.haunting = pData.haunting || false;

    serverStartup(server);

    global.reloadStartupScript(); /* make sure some global constants are loaded */
    server.runCommandSilent("kjs reload server_scripts");

    const vd = server.playerList.getViewDistance();
    DynamicSetting.CHUNK_TICK_DISTANCE.set(Math.ceil(vd / 3), DynamicManager.getInstance(server))
})