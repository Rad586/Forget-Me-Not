global.attackable_pets.forEach(pet => {
    EntityEvents.death(pet, e => {
        const { entity } = e, { owner } = entity;
        if (!owner || e.source.actual == owner) return;

        entity.setHealth(2); /* prevent being one-shot by fire damage */
        entity.discard();

        /* remove agro */
        const refreshed = e.level.createEntity(entity.type);
        refreshed.mergeNbt(entity.nbt);
        refreshed.resetFallDistance(); /* prevent inheriting fall distance */
        refreshed.invulnerableTime = 40; /* prevent consistently dying */
        refreshed.extinguish(); /* prevent consistently dying */

        refreshed.spawn();
        e.cancel()
    })
})