function fireball_modify_tick(entity) {
    if(entity.age > 600) entity.discard();
};
function fireball_modify_spawn(entity) {
    const {owner} = entity;
    if(owner && owner.isPlayer()) entity.level.runCommandSilent(`team join fireball ${entity.uuid}`);
}