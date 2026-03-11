function no_sneaky_raiders(entity) {
    const { level } = entity;
    if (level.isClientSide() || entity.tags.contains("not_sneaky")) return;

    const { x, y, z } = entity;
    if (
        y + 10 < level.getHeight("motion_blocking", x, z) &&
        entity.block.getSkyLight() < 0
    ) {
        entity.mergeNbt({ CanJoinRaid: false })
    }
    else {
        entity.addTag("not_sneaky")
    }
}