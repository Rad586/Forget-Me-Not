function bad_omen_tweak(context) {
    const {entity, effect: {descriptionId}} = context, {level} = entity;
    if(level.isClientSide()) return;

    if(descriptionId == "effect.minecraft.bad_omen") entity.potionEffects.add("kubejs:bad_omen_check", 40, 0, true, false)
    else if(descriptionId == "effect.minecraft.glowing") {
        const monsters = level
            .getEntitiesWithin(entity.boundingBox.inflate(6, 2, 6))
            .filter(e => e.isMonster());
        monsters.forEach(e => e.setTarget(entity))
    }
}