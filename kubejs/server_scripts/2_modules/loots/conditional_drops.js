const annoying_blocks = [
    "_stairs", "_slab", "_fence_gate",
    "_fence", "_carpet", "_wall",
    "_door", "_trapdoor", "_pressure_plate",
    "_button"
]
function conditional_drops(e) {
    e.addLootTypeModifier(LootType.BLOCK)
        .playerPredicate(player => player && player.isCrouching())
        .apply(ctx => {
            const block = ctx.destroyedBlock;
            if (!annoying_blocks.some(i => block.id.endsWith(i))) return;

            const { pos } = block;
            const manager = ctx.level.structureManager();
            const structures = manager.getAllStructuresAt(pos);
            if (structures.isEmpty()) return;

            for (let structure of structures.keySet()) {
                let start = manager.getStructureWithPieceAt(pos, structure);
                if (start && start.isValid()) {
                    ctx.removeLoot(ItemFilter.ALWAYS_TRUE)
                }
            }
        })
}