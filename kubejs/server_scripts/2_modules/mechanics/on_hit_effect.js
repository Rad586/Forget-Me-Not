function on_hit_effect(e, entity, dmg){
	const effectApply = {
		"minecraft:creeper": {
			effect1: "weakness", time1: dmg * 10, level1: 0
		},
		"minecraft:skeleton": {
			effect1: "glowing", time1: dmg * 20, level1: 0, chance1: dmg * 0.02 + 0.02,
			effect2: "kubejs:vulnerability", time1: 60, level2: 0, chance2: 0.1
		},
		"minecraft:slime": {
			effect1: "slippery", time1: dmg + 23, level1: 0,
			effect2: "slowness", time2: dmg + 6, level2: 1
		},
		"minecraft:spider": {
			effect1: "slowness", time1: 40, level1: 0, chance1: 0.085
		},
		"minecraft:piglin": {
			effect1: blood_particle, time1: dmg * 3 + 16, level1: 11, chance1: dmg * 0.05
		},
		"minecraft:zombified_piglin": {
			effect1: blood_particle, time1: dmg * 3 + 16, level1: 11, chance1: dmg * 0.05,
			effect2: "slowness", time2: dmg * 2, level2: 0, chance2: dmg * 0.04
		},
		"minecraft:piglin_brute": {
			effect1: blood_particle, time1: dmg * 3 + 21, level1: 11
		},
		"minecraft:zombie": {
			effect1: blood_particle, time1: dmg * 8 + 26, level1: 11, chance1: dmg * 0.05
		},
		"minecraft:drowned": {
			effect1: "slowness", time1: dmg * 2 + 12, level1: 0, chance1: 0.32
		},
		"minecraft:vindicator": {
			effect1: blood_particle, time1: dmg + 10, level1: 11, chance1: dmg * 0.03,
			effect2: "slowness", time2: dmg + 6, level2: 0, chance2: dmg * 0.03
		},
	};

	const type = e.source.actual;
	if(!effectApply[type]) return;

	const {potionEffects} = entity;
	const {effect1, time1, level1, effect2, time2, level2, chance1, chance2} = effectApply[type];
	if(!chance1 || chance1 > Math.random()) potionEffects.add(effect1, time1, level1);
	if(effect2 && !chance2 || chance2 > Math.random()) potionEffects.add(effect2, time2, level2);
}