function animal_fear(entity, server) {
    const { level, x, y, z } = entity;
    
    for (let i = 0; i < 4; i++) {
        let dx = (i % 2 ? 1 : -1);
        let dz = (i < 2 ? 1 : -1);
        let aabb = AABB.of(x + 24 * dx, y - 12, z + 24 * dz, x, y + 12, z);

        server.scheduleInTicks(i, () => {
            const entities = level.getEntitiesWithin(aabb);
            entities.forEach(e => {
                const { goalSelector } = e;
                if (!goalSelector.getAvailableGoals().some(
                    g => g.getGoal() instanceof PanicGoal)) return;
                goalSelector.addGoal(1, new PanicGoal(e, 2));
                e.setLastHurtByMob(entity) /* requires this for panicing */
            })
        })
    }
}