function enchantmentCheck(entityslots, enchantmentId) {
	entityslots.some(i => {
		if(i.enchantments.containsKey(enchantmentId)) return true;
		else return false;
	})
}

const throttle2 = (temp => (tick) => {
	const now = temp[tick];
	const age = server.tickCount;
	if(!now || age - now >= tick){
		temp[tick] = age;
		return false;
	};
	return true;
})({})

function effectPack(reference, entity) {
    Object.keys(reference).forEach(effect => {
        let data = reference[effect];
		entity.potionEffects.add(effect, data.time, data.amp || 0, data.ambient || true, data.particle || true);
    })
}