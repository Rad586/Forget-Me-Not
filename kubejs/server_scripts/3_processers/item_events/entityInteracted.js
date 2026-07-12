ItemEvents.entityInteracted(e => {
    if (e.hand == "off_hand") return;
    const { entity, target, item } = e, { type } = target;

    if (entity.isCrouching()) {
        dismount_manually(target);
        catching_player(target)
    }
    else if (type == "minecraft:villager") {
        villager_trade(target, entity, e)
    };

    if (type == "guardvillagers:guard") e.cancel();

    unleash(entity, target, e);
    leash_iron_golem(target, item, e)
})