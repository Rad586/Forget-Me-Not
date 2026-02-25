const mob_variant_map = {
    "minecraft:creeper": {
        nether: [
            "elementalcreepers:electric_creeper", "elementalcreepers:illusion_creeper",
            "minecraft:slime"
        ],
        dragon: [
            "enderzoology:concussion_creeper"
        ]
    },
    "minecraft:zombie": {
        nether: [
            "rottencreatures:burned"
        ],
        dragon: [
            "enderzoology:fallen_knight", "enderzoology:infested_zombie"
        ]
    },
    "minecraft:spider": {
        nether: [
        ],
        dragon: [
            "betteranimalsplus:tarantula"
        ]
    },
    "minecraft:skeleton": {
        nether: [
            "skeletalremains:sharpshooterskeleton"
        ],
        dragon: [
            "skeletalremains:charredskeleton", "skeletalremains:overgrownskeleton",
            "minecraft:stray"
        ]
    },
    "minecraft:witch": {
        nether: [

        ],
        dragon: [
            "enderzoology:wither_witch"
        ]
    },
    "rottencreatures:frostbitten": {
        nether: [
        ],
        dragon: [
        ]
    },
    "minecraft:pillager": {
        nether: [
            "minecraft:vindicator", "illagerexp:archivist", 
            "illagerexp:firecaller", "illagerexp:basher",
            "illagerexp:marauder", "takesapillage:skirmisher",
		    "illagerexp:surrendered", "illagerexp:surrendered"
        ],
        dragon: [
            "takesapillage:legioner", "illagerexp:inquisitor"
        ]
    }
};
function mob_variants(entity, data, nether_stage, dragon_stage) {
    const {level} = entity;
    if(!nether_stage || Math.random() > 0.05 || level.isClientSide() || entity.tags.contains("kjsed")) return;
    const {nether, dragon} = data;
    if(dragon_stage) nether.concat(dragon);
    if(nether.length <= 0) return;

    const new_entity = level.createEntity(global.randomSelect(nether));
    new_entity.copyPosition(entity);
    new_entity.spawn();
    new_entity.addTag("kjsed");

    if(new_entity instanceof CrossbowAttackMob) new_entity.setMainHandItem("minecraft:crossbow");
	else if(new_entity instanceof RangedAttackMob) new_entity.setMainHandItem("minecraft:bow");

    entity.discard();
}