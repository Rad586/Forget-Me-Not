function slime_regen(context) {
    const { entity } = context, { level, health, maxHealth } = entity;
    if (level.isClientSide() || health >= maxHealth || !entity.isAlive()) return;

    const regen_map = {
        "minecraft:slime_ball": 2,
        "minecraft:slime_block": 8
    };
    const item_entities = level.getEntities(
        EntityType.ITEM, entity.boundingBox,
        i => Object.keys(regen_map).includes(i.item.id)
    );
    if (item_entities.isEmpty()) return;
    const ie = item_entities.getFirst() , { item } = ie;

    const base = regen_map[item.id], cost = (maxHealth - health) / base;
    item.count -= cost;
    entity.heal(cost * base);

    entity.playSound("entity.puffer_fish.blow_up", 0.48, 1.4);
    global.particleBurst(level, entity, "heart", 3, 0.06, 0.4, entity.eyeY)
}