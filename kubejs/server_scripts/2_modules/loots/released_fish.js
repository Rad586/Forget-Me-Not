function released_fish(e) {
    global.released_fish.forEach(key => 
		e.addEntityLootModifier(key)
			.killedByPlayer()
			.entityPredicate(entity => entity.tags.contains('released'))
			.playerAction(player => player.potionEffects.add("unluck", 12, 0))
			.removeLoot(ItemFilter.ALWAYS_TRUE)
	)
}