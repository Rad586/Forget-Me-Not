// ItemEvents.rightClicked(e => {
// 	const falling_block = e.level.createEntity("falling_block")
// 	falling_block.copyPosition(e.player)
// 	falling_block.setDeltaMovement(e.player.lookAngle.scale(0.5))
// 	falling_block.mergeNbt({
// 		BlockState: {Name: "minecraft:chest"},
// 		TileEntityData: {LootTable: "minecraft:chests/bastion_treasure"}
// 	})
// 	falling_block.spawn()
// })