function splitting_arrow(entity, server) {
    if (Math.random() > 0.05 || entity.level.moonBrightness < 1) return;

    const { owner, level } = entity;
    if (!owner || !(owner instanceof Skeleton)) return;

    owner.setDeltaMovement(owner.lookAngle.scale(-0.5));
    owner.setMotionY(0.25);

    for (let i = 0; i < 0.5 + Math.random(); i++) {
        let arrow = level.createEntity("minecraft:arrow");
        arrow.copyPosition(entity);
        arrow.addTag("kjsed")

        server.scheduleInTicks(1, () => {
            arrow.setDeltaMovement(entity.deltaMovement);
            arrow.addMotion(
                0.6 * (Math.random() > 0.5 ? 1 : -1) + Math.random() * 0.2,
                0,
                0.6 * (Math.random() > 0.5 ? 1 : -1) + Math.random() * 0.2
            );
            arrow.spawn()
        })
    }
}