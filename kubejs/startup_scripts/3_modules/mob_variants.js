const mob_variant_map = {
    "minecraft:creeper": {
        nether: [
            "elementalcreepers:electric_creeper", "elementalcreepers:illusion_creeper",
            "minecraft:slime"
        ],
        fullmoon: [
            "enderzoology:concussion_creeper"
        ]
    },
    "minecraft:zombie": {
        nether: [
            "rottencreatures:burned"
        ],
        fullmoon: [
            "enderzoology:fallen_knight", "enderzoology:infested_zombie"
        ]
    },
    "minecraft:spider": {
        nether: [
        ],
        fullmoon: [
            "betteranimalsplus:tarantula"
        ]
    },
    "minecraft:skeleton": {
        nether: [
            "skeletalremains:sharpshooterskeleton"
        ],
        fullmoon: [
            "skeletalremains:charredskeleton", "skeletalremains:overgrownskeleton",
            "minecraft:stray"
        ]
    },
    "minecraft:witch": {
        nether: [

        ],
        fullmoon: [
            "enderzoology:wither_witch"
        ]
    },
    "minecraft:pillager": {
        nether: [
            "minecraft:vindicator", "illagerexp:archivist",
            "illagerexp:firecaller", "illagerexp:basher",
            "illagerexp:marauder", "takesapillage:skirmisher",
            "illagerexp:surrendered", "illagerexp:surrendered"
        ],
        fullmoon: [
            "takesapillage:legioner", "illagerexp:inquisitor"
        ]
    }
};
function mob_variants(entity, data) {
    if (Math.random() > 0.05) return;
    const { level } = entity;
    if (level.isClientSide() ||
        level.getDayTime() / 24000 < 32 ||
        entity.tags.contains("kjsed")
    ) return;

    const { nether, fullmoon } = data;
    if (level.moonBrightness == 1) nether.concat(fullmoon);
    if (nether.length <= 0) return;

    const new_entity = level.createEntity(global.randomSelect(nether));
    new_entity.copyPosition(entity);
    new_entity.spawn();
    new_entity.addTag("kjsed");

    if (new_entity instanceof CrossbowAttackMob) new_entity.setMainHandItem("minecraft:crossbow");
    else if (new_entity instanceof RangedAttackMob) new_entity.setMainHandItem("minecraft:bow");

    entity.discard();
}