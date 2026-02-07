/* Player related */
EntityEvents.hurt("minecraft:player", e => {
	const {entity, source, damage, server} = e;
	half_heart_protection(e, entity, damage);

	if(source.actual) {
		on_hit_effect(e, entity, damage);
		server.scheduleInTicks(0, () => fight_back_hurt(entity, entity.lastDamageTaken))
	};

	if(entity.isBlocking() && entity.isOnFire()) {
		let { mainHandItem } = entity;
		let { id } = mainHandItem.item instanceof ShieldItem ?
			mainHandItem :
			entity.offHandItem;
		entity.addItemCooldown(id, 10);
		entity.stopUsingItem()
	}
})