/* Idea from Up We Go!(https://modrinth.com/mod/up-we-go) */
function firework_lifter(entity) {
    const {server} = entity; 
    if(!server || entity.tags.contains("kjsed")) return;
    entity.addTag("kjsed");

    const {nbt, level, boundingBox} = entity;
    const time = nbt.LifeTime;

    level.getEntitiesWithin(boundingBox.inflate(0.68)).forEach(entity2 => {
        entity2.motionY += time / 20;
        entity2.hurtMarked = true;
        if(entity2.isPlayer() && entity2.chestArmorItem == "minecraft:elytra") {
            server.scheduleInTicks(5, () => entity2.startFallFlying());
        }
    })
    global.particleRing("spread", 8, 0, -0.1, entity, "cloud", 1.4);
}