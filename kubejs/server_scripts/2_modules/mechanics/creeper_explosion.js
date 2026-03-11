const area_cloud_nbt = (size) => [
    `{
        Radius:1f, RadiusPerTick:0.2f,
        Duration:${size * 9},
        Effects:[{Id:1, Amplifier:0b, Duration:40}],
        ReapplicationDelay:10
    }`,
    `{
        Radius:1f, RadiusPerTick:0.15f,
        Duration:${size * 10},
        Effects:[{Id:2, Amplifier:0b, Duration:20}],
        Particle:"item_slime",
        ReapplicationDelay:10
    }`,
    `{
        Radius:0.5f, RadiusPerTick:0.15f,
        Duration:${size * 11},
        Effects:[{Id:14, Amplifier:0b, Duration:20}],
        Particle:"smoke",
        ReapplicationDelay:10
    }`,
    `{
        Radius:0.5f, RadiusPerTick:0.15f,
        Duration:${size * 9},
        Effects:[{Id:7, Amplifier:0b, Duration:10}],
        ReapplicationDelay:20
    }`
];
function creeper_explosion(level, exploder, x, y, z, size) {
    exploder.removeAllEffects();

    if (exploder.isUnderWater()) {
        level.spawnParticles(
            "bubble_column_up", true,
            x, y + exploder.eyeHeight / 3 * 2, z,
            0.55, 0.55, 0.55,
            12, 0.1
        );
        exploder.playSound("block.bubble_column.whirlpool_inside", 0.6, 1.08);
        return
    }

    level.createExplosion(x, y, z)
        .exploder(exploder)
        .damagesTerrain(Boolean(
            exploder.nbt.ignited))
        .strength(size *
            (exploder.isInWater() ? 0.7 : 1) *
            JavaMath.clamp(exploder.health / 20, size * 0.33, size * 1.1))
        .causesFire(exploder.isOnFire())
        .explode();

    if (Math.random() > 0.1) return;

    const cloud = level.createEntity("area_effect_cloud");
    cloud.copyPosition(exploder);
    cloud.mergeNbt(global.randomSelect(
        area_cloud_nbt(size)));

    cloud.spawn();
    exploder.playSound("block.fire.extinguish", 0.8, 1.5)
}