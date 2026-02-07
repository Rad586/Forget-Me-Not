const star_ores = [
    "minecraft:deepslate_diamond_ore", "minecraft:deepslate_emerald_ore", 
    "minecraft:deepslate_redstone_ore", "minecraft:deepslate_gold_ore", 
    "minecraft:glowstone", "minecraft:amethyst_block", "minecraft:magma_block", 
    "minecraft:blue_ice", "minecraft:gilded_blackstone", "minecraft:coal_block", 
    "minecraft:raw_iron_block", "minecraft:raw_gold_block", "minecraft:budding_amethyst",
    "minecraft:emerald_block", "minecraft:lapis_block", "minecraft:ancient_debris"
];
const starEntity = {
    "phantom": (x, y, z, level) => {
        const count = 4;
        for(let i = 0; i < count; i++) {
            let phantom = level.createEntity("phantom");
            phantom.setPosition(x, y + 5, z);
            phantom.spawn();
        }
    },
    "shulker": (x, y, z, level) => {
        const shulker = level.createEntity("shulker");
        shulker.setPosition(x, y + 1, z);
        shulker.spawn()
    },
    "super_creeper": (x, y, z, level) => {
        const super_creeper = level.createEntity("creeper");
        super_creeper.mergeNbt({powered: true});
        super_creeper.setPosition(x, y + 1, z);
        super_creeper.setMaxHealth(40);
        super_creeper.setHealth(40);
        super_creeper.spawn()
    },
    "big_slime": (x, y, z, level) => {
        const big_slime = level.createEntity("slime");
        big_slime.mergeNbt({Size: 7});
        big_slime.setPosition(x, y + 1, z);
        big_slime.spawn()
    },
    "big_magma_cube": (x, y, z, level) => {
        const big_magma_cube = level.createEntity("magma_cube");
        big_magma_cube.mergeNbt({Size: 7});
        big_magma_cube.setPosition(x, y + 1, z);
        big_magma_cube.spawn()
    },
    "dangerous_enderman": (x, y, z, level) => {
        const dangerous_enderman = level.createEntity("endermanoverhaul:end_islands_enderman");
        dangerous_enderman.setPosition(x, y + 1, z);
        dangerous_enderman.spawn()
    }
}

function falling_star_tick(entity) {
    const {level} = entity;
    if(level.isClientSide()) return;
    const {x, y, z, age} = entity;
    const indexes = age % 30 ? ["minecraft:wax_on", 0.2, 5, 3.6]: ["minecraft:flash", 0, 1, 0];
    const indexes2 = Math.random() < 0.4 ? ["minecraft:falling_lava", 0.4, 3, 0]: ["minecraft:lava", 0, 5, 0];

    level.spawnParticles(indexes[0], true, x, y, z, indexes[1], indexes[1], indexes[1], indexes[2], indexes[3]);
    level.spawnParticles(indexes2[0], true, x, y, z, indexes2[1], indexes2[1], indexes2[1], indexes2[2], indexes2[3]);
}

function explosion(x, y, z, level, server) {
    const oreCount = random.nextInt(5, 10);
    const pi = 3.1415926535;
    y += 2;

    function summon_ore(id, motion, x, y, z) {
        const ore = level.createEntity("falling_block");
        ore.mergeNbt({BlockState: {Name: id}})
        ore.setPosition(x, y + 1, z);
        ore.addMotion(motion[0], motion[1], motion[2]);
        ore.spawn()
    };

    const explosion = level.createExplosion(x, y, z);
    explosion.damagesTerrain(true);
    explosion.strength(8);
    explosion.explode();

    server.scheduleInTicks(1, () => {
        global.particleBurstBlock(level, x, y, z, "lava", 16, 1000000, 1);
        level.spawnParticles("flash", true, x, y, z, 0, 0, 0, 1, 0);

        if(Math.random() < 0.2) starEntity[global.randomSelect(starEntity)](x, y, z, level);
    });

    server.scheduleInTicks(2, () => {
        global.particleBurstBlock(level, x, y, z, "flame", 18, 0.8, 0);
        global.particleBurstBlock(level, x, y, z, "campfire_cosy_smoke", 10, 0.1, 0.6);

        for(let i = 0; i < oreCount; i++) {
            let angle = (i / oreCount) * pi * 2;
            let dx = Math.cos(angle) * 0.124;
            let dz = Math.sin(angle) * 0.124;
            let dy = 0.4;
    
            let motion = [dx, dy, dz];
            summon_ore(global.randomSelect(star_ores), motion, x, y, z);
        }
    })
};

function falling_star_entity(context) {
    const {entity} = context;
    const {level} = entity;
    if(level.isClientSide()) return;

    const {server, x, y, z} = entity;
    const {result: {entity: target}} = context;
    if(target.isPlayer() && !target.stages.has("golden_cudgel")) {
        target.stages.add("golden_cudgel");
        target.give("kubejs:golden_cudgel");

        entity.statusMessage = Text.translate(`dialogue.fmn.unique_item`);
        声声global.sound(entity, "simplyswords:dark_sword_breaks", 0.4, 1.9, 0.1);
        level.spawnParticles("bosses_of_mass_destruction:obsidilith_burst", true, entity.x, entity.eyeY, entity.z, 0, 0, 0, 1, 0);
    }
    else explosion(x, y, z, level, server);
    entity.discard();
};

function falling_star_block(context) {
    const {entity} = context;
    const {level} = entity;
    if(level.isClientSide()) return;

    const {x, y, z, server} = entity;
    explosion(x, y, z, level, server);
    entity.discard();
}