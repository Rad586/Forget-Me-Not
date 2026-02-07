/* Idea from Cake Chomps(https://www.curseforge.com/minecraft/mc-mods/cake-chomps-fabric) */
const cake_particle = global.itemParticle("minecraft:cake");

global.Cakes.forEach(cake => {
    BlockEvents.rightClicked(cake.id, e => {
        const { block, level, player } = e, { pos, properties } = block;

        e.server.scheduleInTicks(0, () => {
            const newBlock = level.getBlock(pos);
            if (properties.bites == newBlock.properties.bites) return;

            const { x, eyeY, z } = player, vec = player.getViewVector(0);
            level.playSound(null, x, eyeY, z, "entity.generic.eat", "master", 0.5, 0.8);
            level.spawnParticles(
                cake_particle, true,
                x + vec.x() * 0.4, eyeY - 0.3, z + vec.z() * 0.4,
                0.07, 0, 0.07,
                2, 0.06
            )
        })
    })
})