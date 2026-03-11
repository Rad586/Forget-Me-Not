function passive_on_low(context) {
    const { entity } = context, { server } = entity;
    if (server && entity.getHealth() / entity.getMaxHealth() <= 0.3 && entity.owner) {
        entity.navigation.moveTo(entity.owner, 1);
        entity.stopBeingAngry();
        server.scheduleInTicks(0, () => entity.stopBeingAngry());
    };
    return true
}