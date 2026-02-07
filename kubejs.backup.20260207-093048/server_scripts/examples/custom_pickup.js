// const ItemEntity = Java.loadClass('net.minecraft.world.entity.item.ItemEntity')
// ItemEvents.rightClicked(e => {
// 	const {player} = e, entity = global.advancedRayTraceEntity(player, 4);
// 	if(!entity || !(entity instanceof ItemEntity)) return;

// 	entity.discard();
// 	const {item} = entity;
// 	player.give(Item.of(item, item.count))
// })