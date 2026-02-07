ItemEvents.entityInteracted(e => {
    if(e.hand == "off_hand") return;
    const {entity, target} = e, {type} = target;

    if(entity.isCrouching()) dismount_manually(target);
    else if(type == "minecraft:villager") {
        if(!villager_trade(target, entity)) e.cancel();
        target.unRide()
    };

    if(type == "guardvillagers:guard") e.cancel();
})