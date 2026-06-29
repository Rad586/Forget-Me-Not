const towers = [
    "totw_reworked:derelict", "totw_modded:derelict", "totw_reworked:derelict_grass",
    "totw_modded:derelict_grass", "totw_reworked:ice", "totw_modded:ice",
    "totw_reworked:ocean_warm", "totw_modded:ocean_warm", "totw_reworked:regular",
    "totw_modded:regular", "totw_reworked:ocean", "totw_modded:ocean",
    "totw_reworked:jungle", "totw_modded:jungle", "totw_modded:desert",
    "totw_modded:badlands", "fmn:sakura", "fmn:yellowstone",
    "fmn:icespikes", "fmn:mushroom", "fmn:mushroom2",
    "fmn:taiga", "fmn:swamp", "fmn:savanna",
    "fmn:hills", "fmn:beach", "fmn:beach2",
    "fmn:beach3", "fmn:mountains"
]
const tp_to_top_msg = Text.translate("dialogue.fmn.tp_to_top").getString()
const { STRUCTURE_REGISTRY } = Registry

function tpEffect(level, x, y, z) {
    level.playSound(null,
        x, y, z,
        "entity.enderman.teleport",
        "players",
        0.8, 1.0
    );
    level.spawnParticles("dragon_breath",
        true,
        x, y, z,
        0, 0, 0,
        20,
        0.2
    )
}
PlayerEvents.advancement("kubejs:in_tower", e => {
    const { level, player } = e;
    player.revokeAdvancement("kubejs:in_tower");

    const { persistentData: pData } = player, { tp } = pData;
    if (tp == null) {
        pData.tp = 0;
        player.setStatusMessage(Text.translate("dialogue.fmn.tp_tip"))
    };
    if (!player.isCrouching() || player.pitch > -74.5) return;

    const manager = level.structureManager();
    const registry = manager.registryAccess()
        .registryOrThrow(STRUCTURE_REGISTRY);
    const structures = manager
        .getAllStructuresAt(player.blockPosition());
    if (structures.isEmpty()) return;

    structures.forEach((structure, longSet) => {
        const id = String(registry.getKey(structure));
        if (!towers.includes(id)) return;

        for (let l of longSet) {
            let { x, y, z } = level
                .getChunk(ChunkPos.getX(l), ChunkPos.getZ(l))
                .getStartForStructure(structure)
                .getBoundingBox()
                .getCenter()
                .offset(0.5, 21, 0.5); /* where the waystone locates at */
            let { x: px, y: py, z: pz } = player;
            if (py - y > 39) return;

            let r = player.hasEffect("kubejs:timer") ? tp + 1 : 0;
            pData.tp = r;

            if (r < 3) {
                player.setStatusMessage([tp_to_top_msg, (3 - pData.tp).toFixed(0)]);
                player.potionEffects.add("kubejs:timer", 21, 0, true, false)
            }
            else {
                player.setPosition(x + 1.5, y, z + 1.5);
                pData.tp = 0;

                tpEffect(level, px, py + 1, pz);
                e.server.scheduleInTicks(1, () => {
                    tpEffect(level, x + 1, y + 1, z + 1)
                })
            }
        }
    })
})