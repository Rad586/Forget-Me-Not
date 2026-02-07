let exploded = false;
LevelEvents.beforeExplosion(e => {
    const { level } = e;
    if (exploded || level.dimension != "minecraft:overworld") return;

    const { exploder, size, x, y, z, server } = e;
    exploded = true;

    if (exploder instanceof Creeper) {
        /* creeper under water = only effects,creeper on water = nerfed, creeper on fire = fiery explosion */
        if (exploder.isUnderWater()) {
            global.particleBurst(exploder, 'bubble_column_up', 12, 0.1, 0.55);
            global.sound(exploder, 'block.bubble_column.whirlpool_inside', 0.6, 1.08);

            /* every cancel requires an "exploded = false" */
            exploded = false;
            e.cancel();
        }
        else {
            let inWater = exploder.isInWater() ? 0.7 : 1;
            let ratio = JavaMath.clamp(exploder.health / 20, size * 0.33, size * 1.1);

            level.createExplosion(x, y, z)
                .exploder(exploder)
                /* creeper explosions won't damage terrain by default */
                .damagesTerrain(exploder.tags.contains("boom"))
                .strength(size * inWater * ratio)
                .causesFire(exploder.isOnFire())
                .explode();
        };

        /* 10% chance of summoning area effect */
        if (Math.random() < 0.1) {
            let area_cloud_nbt = [
                `{Radius:1f,RadiusPerTick:0.2f,Duration:${size * 9},Effects:[{Id:1,Amplifier:0b,Duration:40}],ReapplicationDelay:10}`,
                `{Radius:1f,RadiusPerTick:0.15f,Duration:${size * 10},Effects:[{Id:2,Amplifier:0b,Duration:20}],Particle:"item_slime",ReapplicationDelay:10}`,
                `{Radius:0.5f,RadiusPerTick:0.15f,Duration:${size * 11},Effects:[{Id:14,Amplifier:0b,Duration:20}],Particle:"smoke",ReapplicationDelay:10}`,
                `{Radius:0.5f,RadiusPerTick:0.15f,Duration:${size * 9},Effects:[{Id:7,Amplifier:0b,Duration:10}],ReapplicationDelay:20}`
            ];
            exploder.playSound("minecraft:block.fire.extinguish", 0.8, 1.5 + Math.random() * 0.3);

            let cloud = level.createEntity("minecraft:area_effect_cloud");
            cloud.copyPosition(exploder);
            cloud.mergeNbt(global.randomSelect(area_cloud_nbt));
            cloud.spawn();
        };

        exploded = false;
        e.cancel();
    }

    else if (size < 4) {
        /* explosions won't damage terrain if size < 4 */
        level.createExplosion(x, y, z)
            .strength(size)
            .damagesTerrain(false)
            .causesFire(false)
            .explode();

        exploded = false;
        e.cancel();
    }

    else {
        /* gathering items in range, 30% chance of removing them */
        for (let i = 0; i < 4; i++) {
            let dx = (i % 2 ? 1 : -1);
            let dz = (i < 2 ? 1 : -1);
            let aabb = AABB.of(x + size * dx, y - size, z + size * dz, x, y + size, z);
            server.scheduleInTicks(i, () => {
                const items = level.getEntitiesWithin(aabb).filter(e => e.item != null);
                items.forEach(i => {
                    if (Math.random() > 0.3) return;
                    i.discard()
                })
            })
        }
    };

    exploded = false;
})

/* Creepers damage terrain in this case */
ItemEvents.entityInteracted("minecraft:flint_and_steel", e => {
    const {target} = e;
    if (!(target instanceof Creeper)) return;
    target.addTag("boom")
})