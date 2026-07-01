function item_toss(e) {
    e.addLootTypeModifier(LootType.ENTITY)
        .killedByPlayer()
        .apply(ctx => {
            const { level, entity: { x, y, z } } = ctx;
            ctx.forEachLoot(stack => {
                const item = new ItemEntity(level, x, y, z, stack);
                item.setMotionY(0.5);
                level.addFreshEntity(item)
            });
            ctx.removeLoot(ItemFilter.ALWAYS_TRUE)
        })
}