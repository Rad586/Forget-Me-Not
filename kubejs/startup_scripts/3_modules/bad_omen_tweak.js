function bad_omen_tweak(context) {
    const {entity, effect: {descriptionId}} = context, {level} = entity;
    if(level.isClientSide()) return;

    if(descriptionId == "effect.minecraft.bad_omen") entity.potionEffects.add("kubejs:bad_omen_check", 40, 0, true, false)
    else if(descriptionId == "effect.minecraft.glowing") {
        const {x, y, z} = entity;
        const aabb = AABB.of(x-6, y-2, z-6, x+6, y+2, z+6);
        const monsters = level.getEntitiesWithin(aabb).filter(e => e.isMonster());
        monsters.forEach(e => e.setTarget(entity))
    }
}