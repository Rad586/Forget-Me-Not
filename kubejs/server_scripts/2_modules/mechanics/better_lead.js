function give_lead(entity, target, e) {
    if (!target.isLeashed() || target.getLeashHolder() != entity) return;

    entity.give("lead")
    target.dropLeash(true, false);
    e.cancel()
}

function iron_golem_lead(target, e) {
    if(!(target instanceof IronGolem)) return;
    if (target.nbt.PlayerCreated == false) {
        e.cancel()
    }
}