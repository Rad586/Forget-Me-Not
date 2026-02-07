const medallion_effects = {
	"regeneration": {time: 160},
	"fire_resistance": {time: 800}
}

function medallion(e) {
	const entity = e.entity;

	if(
		entity.level.dimension != "minecraft:the_nether" ||
		e.source.type == "outOfWorld" ||
		entity.isCreative()
	) return;

	const handItem = entity.handSlots.find(item => {	
		if(item.id == "kubejs:medallion_of_undying") return true;
		return false;
	});

	if(!handItem) return;

	handItem.count--;
	effectPack(medallion_effects, entity);

	entity.sendData("totemAnimation", {item: "kubejs:medallion_of_undying_activated"});
	global.particleBurst(entity, "minecraft:totem_of_undying", 30, 0.6);
	global.sound(entity, "item.totem.use", 0.7, 1.8, 0.2);

	entity.setHealth(1.0);
	e.cancel();
}