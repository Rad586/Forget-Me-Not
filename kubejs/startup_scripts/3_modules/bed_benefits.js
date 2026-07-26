/* Idea from: Bed Benefits(https://www.curseforge.com/minecraft/mc-mods/bed-benefits) */
function bed_benefits(entity) {
    const { level } = entity;
    if (level.isClientSide() || level.dayTime() != 24000) return;
    entity.setHealth(100)
}