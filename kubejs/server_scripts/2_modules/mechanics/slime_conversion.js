ItemEvents.entityInteracted("minecraft:flint_and_steel", e => {
    const { target, level } = e;
    if (target.type != "minecraft:slime") return;

    const magma_cube = level.createEntity("minecraft:magma_cube")
    magma_cube.copyPosition(target);
    magma_cube.setRotation(target.yaw, target.pitch);
    magma_cube.setHealth(target.health);
    magma_cube.mergeNbt({ Size: target.nbt.Size })

    magma_cube.spawn();
    target.discard();

    level.spawnParticles(
        "minecraft:flame", true,
        target.x, target.y + 0.5, target.z,
        0, 0, 0, 3, 0.1
    )
})