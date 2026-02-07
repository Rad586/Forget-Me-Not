function mounted_mobs(entity, nether_stage, riderData) {
    if(!nether_stage || Math.random() > 0.01 || entity.tags.contains("kjsed")) return;
    entity.addTag("kjsed");

    const rider = entity.level.createEntity(riderData);
    if(riderData == "minecraft:skeleton") rider.setMainHandItem("bow");
    
    rider.copyPosition(entity);
    rider.startRiding(entity);
    rider.addTag("kjsed");
    rider.spawn();
}