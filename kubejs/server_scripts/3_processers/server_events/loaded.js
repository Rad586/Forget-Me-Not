let entity_drop, keep_inv, trade;
ServerEvents.loaded(e => {
    const {server} = e, {persistentData: pData} = server;

    keep_inv = server.gameRules.get("keepInventory");
    entity_drop = pData.entity_drop || false;
    trade = pData.trade || false;
    global.haunting = pData.haunting || false;

    serverStartup(server);

    server.runCommandSilent("servercore settings chunk_tick_distance 3");
    server.runCommandSilent("kjs reload startup_scripts"); /* make sure some global constants are loaded */
    // server.runCommandSilent("kjs reload client_scripts");
    server.runCommandSilent("kjs reload server_scripts");

    const range = Math.min(256, server.playerList.setSimulationDistance() * 16);
    EntityOpt.verticalRange = range;
    EntityOpt.horizontalRange = range
})