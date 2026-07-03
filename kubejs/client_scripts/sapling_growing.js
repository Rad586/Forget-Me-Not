function is2x2(level, pos, id) {
    for (let [dx, dz] of [[0, 0], [-1, 0], [0, -1], [-1, -1]]) {
        let positions = [
            pos.offset(dx, 0, dz),
            pos.offset(dx + 1, 0, dz),
            pos.offset(dx, 0, dz + 1),
            pos.offset(dx + 1, 0, dz + 1)
        ];
        if (!positions.some(p => level.getBlock(p).id != id)) {
            return true
        }
    };
    return false
}
BlockEvents.rightClicked("dark_oak_sapling", e => {
    if (is2x2(e.level, e.block.pos, "minecraft:dark_oak_sapling") ||
        !e.item.is("bone_meal")) return;

    e.player.setStatusMessage(Text.translate("dialogue.fmn.sapling_growing"));
    e.cancel()
})