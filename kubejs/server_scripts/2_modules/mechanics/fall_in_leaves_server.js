/* Idea from Passable Leaves(https://modrinth.com/mod/passable-leaves) */
NetworkEvents.dataReceived("leaves", e => {
    const { player, level } = e;

    player.resetFallDistance();
    player.setMotionY(0);
    player.hurtMarked = true;

    const { x, y, z } = player;
    level.spawnParticles(
        global.blockParticle(e.data.id), true,
        x, y, z,
        0.4, 0, 0.4,
        8, 0.2
    );
    level.playSound(null, x, y, z, "block.grass.fall", "players", 1.36, 0.8)
})