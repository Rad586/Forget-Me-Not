function haunting(e) {
    e.addLootTypeModifier(LootType.ENTITY)
        .killedByPlayer()
        .entityPredicate(entity => {
            if (!entity.isMonster()) return true;

            const { level } = entity;
            const next_entity = level
                .getEntitiesWithin(entity.boundingBox.inflate(0.6, 0, 0.6))
                .filter(n => n.isMonster() && n != entity);
            if (next_entity.isEmpty()) return true;

            const { persistentData: pData } = next_entity.getFirst();
            const { victim } = pData;
            pData.victim = (victim || 0) + (entity.persistentData.victim || 0) + 1;

            if (pData.victim % 9 || haunting_off == true) return true;

            const vex = level.createEntity("minecraft:vex");
            vex.copyPosition(entity);
            vex.setMainHandItem(Item.of("minecraft:wooden_sword").enchant("minecraft:vanishing_curse", 1));
            vex.setTarget(entity.lastHurtByMob || null)
            vex.spawn();

            const { x, y, z } = entity;
            entity.playSound("minecraft:entity.vex.death");
            level.spawnParticles("minecraft:soul_fire_flame", true, x, y, z, 0.08, 0.08, 0.08, 4, 0);
            level.spawnParticles("minecraft:sculk_soul", true, x, y, z, 0.08, 0.08, 0.08, 3, 0.06);
            return true
        })
}