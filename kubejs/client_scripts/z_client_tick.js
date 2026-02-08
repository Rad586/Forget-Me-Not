const tasks = [[
    modBobby, modPingwheelRefresh,
    modPhysics, dynamicFps
]]
tasks.push(Math.ceil(tasks.length / 2))

let previous = 0;
ClientEvents.tick(e => {
    const { player } = e;
    const now = Date.now();

    fallInLeavesClient(player);
    modFootstep(player);

    if (now - previous < 250) return;
    previous = now;

    tasks[0].splice(0, tasks[1]).forEach(t => (t(player), tasks[0].push(t)))
})