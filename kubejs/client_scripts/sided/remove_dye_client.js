global.dye_remover = [
    "minecraft:water_bucket", "minecraft:potion"
]
function removeDye(player, carried, hovered) {
    if (!global.dye_remover.includes(carried.id)) return;

    const { nbt } = carried;
    if (nbt && nbt.Potion != "minecraft:water") return;

    const { nbt: nbt2 } = hovered.stack;
    if (!nbt2 || !nbt2.dye) return;

    player.sendData("removedye", { slot: hovered.slot });
    uiSound("entity.player.splash.high_speed", 0.15)
}