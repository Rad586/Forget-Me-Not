const tasks = [[
    modBobby, modPingwheelRefresh,
    modPhysics, dynamicFps
]]
tasks.push(Math.ceil(tasks.length / 2))

let previous = 0, last_pos = [0, 0, 0], limit_old, dynfpsing
ClientEvents.tick(e => {
    const { player, level } = e;
    const now = Date.now();

    if (!Client.isPaused()) {
        let { age } = player;
        gliding_client(level, player, age);
        fallInLeavesClient(player);
        modFootstep(player, age);
        sitClient(player);

        let hovered = getHovered();
        if (hovered) {
            removeItem(player, hovered);
            showItem(player, hovered);
            
            hoveredRc(player, hovered, (player, carried, hovered) => {
                // Utils.server.tell('hi')
                removeDye(player, carried, hovered)
            })
        }
    }

    if (now - previous < 250) return;
    previous = now;

    tasks[0].splice(0, tasks[1]).forEach(t => (t(player), tasks[0].push(t)));

    last_pos = [player.x, player.y, player.z];

    if (limit_old) return;
    const temp = player.getStringUuid();

    limit_old = "olmt" + temp;
    dynfpsing = "dfps" + temp
})