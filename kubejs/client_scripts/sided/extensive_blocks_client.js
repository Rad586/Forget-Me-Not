const extensiveBlocks = [
    "minecraft:redstone_wire", "minecraft:ladder", "minecraft:rail",
    "minecraft:powered_rail", "minecraft:detector_rail", "minecraft:activator_rail"
];

extensiveBlocks.forEach(eBlock => {
    BlockEvents.rightClicked(eBlock, e => {
        const { player } = e;
        if (e.hand == "off_hand" || !player.isCrouching()) return;

        const { facing } = player, { opposite } = facing;
        if (e.facing == opposite) return;

        const {x, y, z} = e.block;
        player.sendData("extensive_blocks", {
            opposite: String(opposite), pos: [x, y, z], eBlock: eBlock, facing: String(facing)
        })
    })
})