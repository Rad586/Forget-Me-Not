function animal_fear(entity, server) {
    const { level } = entity;
    const entities = level
        .getEntitiesWithin(entity.boundingBox.inflate(24));

    entities.forEach(e => {
        if (!e.isLiving() || !e.isAlive()) return;
        const { goalSelector } = e;
        if (!goalSelector.getAvailableGoals().some(
            g => g.getGoal() instanceof PanicGoal)) return;

        goalSelector.addGoal(1, new PanicGoal(e, 2));
        e.setLastHurtByMob(entity) /* requires this for panicing */
    })
}