PlayerEvents.loggedIn(e => {
	const {player} = e, {persistentData: pData} = player;

	if (pData.sets_i == null) pData.sets_i = 0;

	player.sendData(
		"auto_pickup", {status: pData.auto_pickup == null ? true: pData.auto_pickup}
	);
	player.sendData(
		"armor_set", {num: pData.sets_i}
	)
})