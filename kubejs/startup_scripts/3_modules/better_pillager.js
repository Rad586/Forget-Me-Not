const pillager_weapons = [
    "minecraft:wooden_sword", "minecraft:stone_sword", "minecraft:stone_shovel",
    "minecraft:stone_pickaxe"
];
const vindicator_weapons = [
    "minecraft:iron_sword"
];
const horns = ["ponder", "sing", "seek", "feel", "admire", "call", "yearn", "dream"];
const pillager_weapon_skills = {
    "minecraft:crossbow": (entity, source) => {
        if(Math.random() < 0.2) source.setOffHandItem("firework_rocket");
        else if(Math.random() < 0.08) {
            const {level, server} = entity;
            /* Prepare using(can be interrupted) */
            source.setOffHandItem("goat_horn");
            server.scheduleInTicks(20, () => {
                if(source.offHandItem.id != "minecraft:goat_hurn") return;
                source.playSound("minecraft:item.goat_horn.sound.6", 0.5, 2);
                /* Start using */
                server.scheduleInTicks(10, () => {
                    level.spawnParticles("minecraft:note", true, x, y+0.25, z, 0, 0, 0, 1, 0);
                    level.getEntitiesWithin(source.boundingBox.inflate(8)).forEach(entity2 => {
                        if(!entity2.isMonster()) return
                        entity2.potionEffects.add("speed", 400, 0);
                        entity2.target = entity;
                    });
                    /* Finish using */
                    source.setOffHandItem("air");
                })
            })
        }
    },
    "minecraft:stone_pickaxe": (entity, source) => {
        if(entity.type != "minecraft:iron_golem") return;
        entity.potionEffects.add("slowness", 40, 9);
        entity.potionEffects.add("weakness", 40, 99);
        global.sound(entity, "minecraft:entity.iron_golem.damage", 0.5, 1.2, 0.2);
    },
    "minecraft:stone_shovel": (entity, source) => {
        entity.potionEffects.add("slowness", 40, 2, true, false);
        global.sound(source, "minecraft:block.stone.place", 0.5, 0.5, 0.2);
    }
};

function pillager_spawn(entity) {
    if(Math.random() < 0.33 && !entity.tags.contains("kjsed")) {
        entity.addTag("kjsed");
        entity.goalSelector.addGoal(1, new MeleeAttackGoal(entity, 1, true));
        if(!entity.isPatrolLeader()) entity.setMainHandItem(global.randomSelect(pillager_weapons));
        else entity.setMainHandItem(global.randomSelect(vindicator_weapons));

        entity.setAttributeBaseValue("minecraft:generic.attack_damage", 3);
        entity.setAttributeBaseValue("minecraft:generic.movement_speed", 0.3);
    }
};
function vindicator_spawn(entity) {
    if(Math.random() < 0.75 && !entity.tags.contains("kjsed")) {
        entity.addTag("kjsed");
        entity.setMainHandItem(global.randomSelect(vindicator_weapons));
    }
};
function loot_goat_horn(entity) {
    if(entity.offHandItem.id != "minecraft:goat_horn") return;
    entity.setOffHandItem("air");
    entity.block.up.popItemFromFace(Item.of("minecraft:goat_horn", `{instrument:"minecraft:${global.randomSelect(horns)}_goat_horn"}`), entity.facing);
};
function illusioner(entity) {
    if(
        Math.random() > 0.0001 || 
        !entity.isAlive() || 
        ["PEACEFUL", "EASY"].includes(entity.level.getDifficulty().toString())
    ) return;
    const {x, y, z, level, eyeHeight} = entity;
    const center = y + eyeHeight*0.66;
    const random = Math.random();

    entity.discard();
    const illusioner = level.createEntity("minecraft:illusioner");
    illusioner.copyPosition(entity);
    illusioner.y -= 1;
    illusioner.setMotionY(0.42);
    illusioner.potionEffects.add("glowing", 12, 0, true, false);
    illusioner.spawn();

    entity.playSound("minecraft:entity.illusioner.cast_spell", 0.8, 1.8 + random*0.2);
    entity.playSound("minecraft:entity.illusioner.mirror_move", 0.9, 0.8 + random*0.2);
    entity.playSound("minecraft:entity.illusioner.ambient", 2, 1.25 + random*0.2);
    entity.playSound("minecraft:entity.firework_rocket.large_blast", 1, 0.5 + random*0.2);

    level.spawnParticles("flash", true, x, center, z, 0, 0, 0, 1, 0);
    level.spawnParticles("cloud", true, x, center, z, 0.1, 0.2, 0.1, 25, 0.16);
    level.spawnParticles("firework", true, x, center, z, 0.1, 0.2, 0.1, 18, 0.16);
};
function pillager_skill(context) {
    const {entity, targetEntity} = context;
    if(!entity.server) return;
    
    const skill = pillager_weapon_skills[entity.mainHandItem.id];
    if(skill) skill(targetEntity, entity);
}