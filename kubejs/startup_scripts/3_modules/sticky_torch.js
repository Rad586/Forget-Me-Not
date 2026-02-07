function stick_torch_entity(entity, target) {
    const { server } = entity;
    if (!server) return;
    target.setSecondsOnFire(2);
    entity.discard();
};

function stick_torch_block(entity, result) {
    const { level } = entity;
    if (level.isClientSide()) return;

    if (result.direction == "down") {
        const { deltaMovement } = entity;
        entity.setDeltaMovement(deltaMovement.multiply(0.7, -0.6, 0.7))
        global.particleBurst(entity, "item_slime", 2);
        global.sound(entity, "block.slime_block.place", 0.25, 1.1);
    }
    else {
        entity.discard();

        const player = entity.server.players.getFirst();
        if (!player) return;

        const torch_type = level
            .getBlock(result.blockPos)
            .hasTag("minecraft:soul_fire_base_blocks") ?
            "soul_" : ""
            + "torch";
        const use_result = Item.of(torch_type)
            .useOn(new UseOnContext(
                level, player, null, Item.of("air"), result
            )) == "CONSUME";
        if (!use_result) {
            const item = level.createEntity("item");
            item.setItem(torch_type);
            item.copyPosition(entity);
            item.setMotion(0, 0.3, 0);
            item.spawn();
        }
        global.sound(entity, `block.wood.${!use_result ? "place" : "break"}`, 0.8);
    }
}