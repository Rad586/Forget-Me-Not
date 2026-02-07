function flame_effect(entity) {
    const {owner} = entity;
    if(!owner || !owner.isLiving()) return;

    if(owner.hasEffect("kubejs:soul_flame")) {
        entity.setSecondsOnFire(10);
        entity.fireType = "minecraft:soul";
    }
    else if(owner.hasEffect("kubejs:flame")) {
        entity.setSecondsOnFire(10);
    }
}