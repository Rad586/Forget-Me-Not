const pillager_weapon_skills = {
    "minecraft:wooden_sword": () => { },
    "minecraft:stone_sword": () => { },
    "minecraft:stone_pickaxe": (entity, source) => {
        if (entity.type != "minecraft:iron_golem") return;
        entity.potionEffects.add("slowness", 40, 9);
        entity.potionEffects.add("weakness", 40, 99);
        global.sound(entity.level, entity, "minecraft:entity.iron_golem.damage", 0.5, 1.2);
    },
    "minecraft:stone_shovel": (entity, source) => {
        entity.potionEffects.add("slowness", 40, 2, true, false);
        global.sound(entity.level, source, "minecraft:block.stone.place", 0.5, 0.5);
    }
};

function pillager_spawn(entity) {
    if (Math.random() > 0.33 || entity.tags.contains("kjsed")) return;

    entity.addTag("kjsed");
    entity.goalSelector.addGoal(1, new MeleeAttackGoal(entity, 1, true));
    if (!entity.isPatrolLeader()) {
        entity.setMainHandItem(global.randomSelect(pillager_weapon_skills))
    }
    else {
        entity.setMainHandItem("minecraft:iron_sword")
    };

    entity.setAttributeBaseValue("minecraft:generic.attack_damage", 1);
    entity.setAttributeBaseValue("minecraft:generic.movement_speed", 0.3);
};
function vindicator_spawn(entity) {
    if (entity.tags.contains("kjsed")) return;
    entity.addTag("kjsed");
    entity.setMainHandItem("minecraft:iron_sword")
};
function illusioner(entity) {
    if (Math.random() > 0.0001 ||
        !entity.isAlive() ||
        ["peaceful", "easy"].includes(entity.level.difficulty.getKey())
    ) return;
    const { x, y, z, level, eyeHeight } = entity;
    const center = y + eyeHeight * 0.66;
    const random = Math.random();

    entity.discard();
    const illusioner = level.createEntity("minecraft:illusioner");
    illusioner.copyPosition(entity);
    illusioner.y -= 1;
    illusioner.setMotionY(0.42);
    illusioner.potionEffects.add("glowing", 12, 0, true, false);
    illusioner.spawn();

    entity.playSound("entity.illusioner.cast_spell", 0.8, 1.8 + random * 0.2);
    entity.playSound("entity.illusioner.mirror_move", 0.9, 0.8 + random * 0.2);
    entity.playSound("entity.illusioner.ambient", 2, 1.25 + random * 0.2);
    entity.playSound("entity.firework_rocket.large_blast", 1, 0.5 + random * 0.2);

    level.spawnParticles("flash", true, x, center, z, 0, 0, 0, 1, 0);
    level.spawnParticles("cloud", true, x, center, z, 0.1, 0.2, 0.1, 25, 0.16);
    level.spawnParticles("firework", true, x, center, z, 0.1, 0.2, 0.1, 18, 0.16);
};
function pillager_skill(context) {
    const { entity, targetEntity } = context;
    if (!entity.server) return;

    const skill = pillager_weapon_skills[entity.mainHandItem.id];
    if (skill) skill(targetEntity, entity);
}