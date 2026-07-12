function unleash(entity, target, e) {
    if (!target.isLeashed() || target.getLeashHolder() != entity) return;

    entity.give("lead")
    target.dropLeash(true, false);
    e.cancel()
}