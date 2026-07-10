function fire_disables_shield(entity) {
    if (!entity.isBlocking() || !entity.isOnFire()) return;

    const shield = entity.mainHandItem.item instanceof ShieldItem
        ? entity.mainHandItem
        : entity.offHandItem;

    entity.addItemCooldown(shield.id, 10);
    entity.stopUsingItem()
}