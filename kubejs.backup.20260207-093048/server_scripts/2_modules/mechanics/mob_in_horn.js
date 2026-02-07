ItemEvents.entityInteracted("minecraft:goat_horn", e => {
    const { target, player } = e;
    if (player.cooldowns.isOnCooldown("minecraft:goat_horn") ||
        !(target instanceof OwnableEntity) || 
        !target.isLiving()
    ) return;

    const { owner } = target, { nbt } = e.item;
    if (!owner || owner != player || 
        nbt.Type || nbt.instrument == "minecraft:sing_goat_horn"
    ) return;

    target.discard();
    nbt.merge({
        Name: target.displayName.getString(),
        Type: target.type,
        Storage: target.nbt
    });

    global.sound(player, "item.bottle.fill_dragonbreath", 0.3, 1.2);
    player.swing();
    e.cancel()
})

function summonMount(e, x, y, z) {
    const {item} = e, { nbt } = item, { Type, Storage } = nbt;
    if (!Type) return;

    const mount = e.level.createEntity(Type);
    mount.mergeNbt(Storage);
    mount.setPosition(x, y, z);
    mount.spawn();

    nbt.remove("Name");
    nbt.remove("Type");
    nbt.remove("Storage");
    mount.playSound("item.armor.equip_leather", 1, 1.2)
}
ItemEvents.rightClicked("minecraft:goat_horn", e => {
    const { x, y, z } = e.player;
    summonMount(e, x, y, z)
})
BlockEvents.rightClicked(e => {
    if (e.hand == "off_hand" || e.item.id != "minecraft:goat_horn") return;
    const { x, y, z } = e.block[e.facing];
    summonMount(e, x + 0.5, y + 0.5, z + 0.5)
})