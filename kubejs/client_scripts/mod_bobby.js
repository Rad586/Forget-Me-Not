/* executed in client_tick.js */
const BobbyConfig = Java.loadClass('de.johni0702.minecraft.bobby.Bobby').getInstance().getConfig()
let stay = 0, last_pos = [0, 0]

function modBobby(player) {
    const { x, z } = player, { options } = Client;
    const rd = options.renderDistance().get();

    player.tell(Math.hypot(last_pos[0] - x, last_pos[1] - z))
    if (Math.hypot(last_pos[0] - x, last_pos[1] - z) < 5.3) { /* sprinting > n > walking */
        if (!Client.isPaused()) stay++ /* pause with game pause */
    }
    else stay = 0;
    last_pos = [x, z];

    const initial_timeout = 8;
    const interval = 6;
    const internal_vd = stay && stay >= initial_timeout ? 
        rd + Math.min(
            Math.min(32 - rd, Math.round(rd * 0.34)), 
            Math.floor((stay - initial_timeout) / interval) - 1) : 
        Math.round(rd * 0.84);

    if (BobbyConfig.viewDistanceOverwrite == internal_vd) return;
    BobbyConfig.viewDistanceOverwrite = internal_vd;

    if (!Client.isLocalServer()) return;
    Client.getSingleplayerServer().playerList.setSimulationDistance(options.simulationDistance().get())
}

/* fix leaving game after being idle, causing joining with high bobby view distance */
ClientEvents.loggedOut(e => {
    stay = 0;
    BobbyConfig.viewDistanceOverwrite = Math.round(
        Client.options.renderDistance().get() * 0.84
    )
})