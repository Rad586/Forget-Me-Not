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

    let i = 0
    // server.scheduleInTicks(1, (c) => {
    //     i++;
    //     c.reschedule()

    //     if(i != 1 && i % 20) return;
    //     server.tell(i/20 + "s, sd: "+ server.playerList.getSimulationDistance())
    // })

    const vd = server.playerList.getViewDistance();
    DynamicSetting.CHUNK_TICK_DISTANCE.set(Math.ceil(vd / 3), DynamicManager.getInstance(server))

    // const range = sd * 16;
    // console.log(range)
    // EntityOpt.verticalRange = range;
    // EntityOpt.horizontalRange = range
    // console.log("rd: " + Client.options.renderDistance().get())
    // console.log("vd: " + server.playerList.getViewDistance())
    // console.log("sd: " + server.playerList.getSimulationDistance())
})