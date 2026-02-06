function passive_on_low(context) {
    const { entity } = context, { server } = entity;
    if (server && entity.health <= 6 && entity.owner) {
        entity.navigation.moveTo(entity.owner, 1);
        entity.stopBeingAngry();
        server.scheduleInTicks(0, () => entity.stopBeingAngry());
    };
    return true
}