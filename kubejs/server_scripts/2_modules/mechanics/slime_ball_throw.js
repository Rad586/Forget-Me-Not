ItemEvents.rightClicked("minecraft:slime_ball", e => {
	const {level, player, item} = e;
	item.count--;
	const ball = level.createEntity("kubejs:slime_ball");

	ball.setDeltaMovement(player.lookAngle.scale(1));
	ball.copyPosition(player);
	ball.setY(player.eyeY)
	ball.setOwner(player)
	ball.spawn();

	e.cancel()
})