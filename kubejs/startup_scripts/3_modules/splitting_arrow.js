function splitting_arrow(entity, dragon_stage, server) {
    if(!dragon_stage || Math.random() > 0.05 || entity.tags.contains("split")) return;
    const {level} = entity;

    const {owner} = entity;
    if(!owner || !(owner instanceof Skeleton)) return;

    for(let i = 0; i < 0.5+Math.random(); i++) {
        let arrow = level.createEntity("minecraft:arrow");
        arrow.copyPosition(entity);
        arrow.addTag("split")
    
        server.scheduleInTicks(0, () => {
            arrow.setDeltaMovement(entity.deltaMovement)
            arrow.addMotion(
                0.6 * (Math.random() > 0.5 ? 1 : -1) + Math.random()*0.2,
                0,
                0.6 * (Math.random() > 0.5 ? 1 : -1) + Math.random()*0.2
            )
            arrow.spawn()
        })
    }
}