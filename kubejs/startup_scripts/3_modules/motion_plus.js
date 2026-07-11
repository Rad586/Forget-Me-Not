function motion_plus(entity) {
    const { owner } = entity;
    if (!owner) return;
    entity.addMotion(owner.motionX / 2, 0, owner.motionZ / 2);
}