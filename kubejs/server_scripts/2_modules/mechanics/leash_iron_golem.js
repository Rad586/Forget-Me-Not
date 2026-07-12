
function leash_iron_golem(target, item, e) {
    if (!(target instanceof IronGolem) || !item.is("minecraft:lead")) return;
    if (target.nbt.PlayerCreated == false) {
        e.cancel()
    }
}