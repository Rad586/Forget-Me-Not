global.dimensionalMobs = {
    "minecraft:iron_golem": {
        dimension: ["minecraft:overworld"],
        item: "4x minecraft:iron_block",
        sound: "minecraft:block.stone.break",
        volume: 0.7,
        pitch: 0.6 + Math.random() * 0.2
    },
    "minecraft:snow_golem": {
        dimension: ["minecraft:overworld"],
        item: "2x minecraft:snow_block",
        sound: "minecraft:block.snow.place",
        volume: 2,
        pitch: 0.7 + Math.random() * 0.2
    },
    "minecraft:wither": {
        dimension: ["minecraft:the_nether", "minecraft:the_end"],
        item: "3x minecraft:wither_skeleton_skull",
        sound: "minecraft:entity.wither.break_block",
        volume: 0.3,
        pitch: 1.1 + Math.random() * 0.2
    }
};
function dimensional_mobs(entity, data) {
    const {level} = entity;
    if(level.isClientSide()) return;

    if(data.dimension.includes(level.dimension.toString())) return;

    const itemEntity = level.createEntity("minecraft:item");
    itemEntity.item = data.item;
    itemEntity.copyPosition(entity);
    itemEntity.y += entity.eyeHeight/3;
    itemEntity.motionY += 0.5;
    itemEntity.spawn();

    entity.playSound(data.sound, data.volume, data.pitch);
    global.particleBurst(entity, "large_smoke", 20, 0.06);
    entity.discard();
}