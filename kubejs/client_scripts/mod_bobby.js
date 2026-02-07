/* executed in client_tick.js */
const BobbyConfig = Java.loadClass('de.johni0702.minecraft.bobby.Bobby').getInstance().getConfig()
let staying = 0, last_pos = [0, 0]

function modBobby(player) {
    const { x, z } = player;
    const rd = Client.options.renderDistance().get();

    if (Math.hypot(last_pos[0] - x, last_pos[1] - z) < 10) { /* sprinting > 10 > walking */
        if (!Client.isPaused()) staying++ /* pause with game pause */
    }
    else staying = 0;
    last_pos = [x, z];

    const internal_vd = staying >= 8 ? /* initial timeout: 8s */
        rd + Math.min(Math.min(32, Math.round(rd * 1.34)), Math.floor(staying / 5) - 1) : /* +1 every 5s */
        Math.round(rd * 0.84);

    if (BobbyConfig.viewDistanceOverwrite == internal_vd) return;
    BobbyConfig.viewDistanceOverwrite = internal_vd
}