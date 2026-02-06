function motionPlus(entity) {
    const {owner, tags} = entity;
    if(!owner || tags.contains("motion")) return;
    entity.addTag("motion");
    entity.addMotion(owner.motionX / 2, 0, owner.motionZ / 2);
}