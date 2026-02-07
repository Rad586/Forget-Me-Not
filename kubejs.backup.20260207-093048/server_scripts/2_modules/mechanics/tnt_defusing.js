ItemEvents.rightClicked("minecraft:shears", e => {
	const {target: {entity}, level} = e;
	if(!entity || entity.type != "minecraft:tnt") return;
	entity.playSound("minecraft:entity.sheep.shear", 0.8, 1.6);
	entity.discard();
	
	const item = level.createEntity("minecraft:item");
	item.copyPosition(entity);
	item.setItem("minecraft:tnt");
	item.setMotionY(0.3);
	item.spawn()
})