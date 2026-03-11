function pet_immunity(context) {
    const { entity } = context;
    if (!entity.server) return false;
    return entity.owner && ["cactus", "inFire", "cramming",
        "freeze", "hotFloor", "sweetBerryBush"].includes(context.damageSource.type)
}