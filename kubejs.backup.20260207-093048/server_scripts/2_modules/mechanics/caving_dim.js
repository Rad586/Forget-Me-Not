PlayerEvents.advancement("kubejs:caving_dim", e => {
	const {player} = e;
	const {xpLevel, persistentData:pData} = player;
	const {cave_time: initial_time} = pData;
	function calculate(value) {return (value%60 * 10).toFixed(0)};

	player.revokeAdvancement("kubejs:caving_dim");

	if(xpLevel > 1) {
		const cost_initial = calculate(initial_time);

		pData.cave_time = initial_time ? initial_time + 1 : 1;
		const cost_now = calculate(pData.cave_time);
		player.addXPLevels(- (1+cost_now)) //+1 every 10 min

		if(cost_now != cost_initial) {
			player.statusMessage = Text.translate("dialoge.fmn.cost_increased").append(cost_now);
		};

		if(xpLevel <= 5) {
			/* play sound! */
		}
	}
	else {
		const itemEntities = player.level.entities.filter(e => e.item != null);
		itemEntities.forEach(e => e.discard());

		/* 还原上次等级，上个地点，上个背包，提示本次得分与最高得分 */
	}
})