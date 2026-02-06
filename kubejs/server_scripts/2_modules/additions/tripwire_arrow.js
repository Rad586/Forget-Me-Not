PlayerEvents.chestOpened(e => {
	const {inventory} = e;
	const slot = inventory.find("kubejs:tripwire_arrow");
	if(slot == -1) return;

	const {player, level, block} = e;
	const item = inventory.getItem(slot);
	item.count--;

	const {x, y, z} = block;
	const vec = player.getViewVector(1).scale(-1);

	const arrow = level.createEntity("minecraft:arrow");
	arrow.setPosition(x+0.5+vec.x(), y+0.5+vec.y(), z+0.5+vec.z());
	arrow.setDeltaMovement(vec);
	arrow.spawn()
})