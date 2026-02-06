/* Idea from Passable Leaves(https://modrinth.com/mod/passable-leaves) */
/* executed in client_tick.js */
function fallInLeavesClient(player) {
    if (player.getMotionY() > -0.86) return;

    const { block } = player;
    if (!block.hasTag("minecraft:leaves")) return;
    player.sendData("leaves", { id: block.id })
}