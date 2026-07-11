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
    if (level.getDayTime() / 24000 < 32) return;

    const { nether, fullmoon } = data;
    if (level.moonBrightness == 1) nether.concat(fullmoon);
    if (nether.length <= 0) return;

    const new_entity = global.spawnEntity(level, 
        global.randomSelect(nether), entity.blockPosition());
    new_entity.addTag("kjsed");

    entity.discard()
}