global.ores = [
	"diamond_ore", "redstone_ore",
	"deepslate_diamond_ore", "deepslate_redstone_ore"
];
StartupEvents.registry("entity_type", e => {
	global.ores.forEach(ore => {
		e.create(ore, "entityjs:mob")
			.noEggItem() /* so it wont conflict with the actual ores */
			.setRenderType("solid")
			.sized(1, 1)
			.modelSize(1, 1)
			.defaultDeathPose(false)

			.canBreatheUnderwater(true)
			.fireImmune(true)
			.setSoundVolume(0)
			.isPushable(false)

			.isInvulnerableTo(context => context.damageSource.type != "player")
			.canBeAffected(() => false)
			.setHurtSound(() => "minecraft:block.stone.hit")
			.onDeath(context => {
				const {entity} = context;
				const falling_block = entity.level.createEntity("falling_block");

				global.sound(entity, "block.stone.break", 1.2);
				global.particleBurst(entity, "visuality:sparkle", 8, 0, 0.4);
				entity.discard();

				falling_block.mergeNbt({BlockState: {Name: `minecraft:${ore}`}});
				falling_block.copyPosition(entity);
				falling_block.motionY += 0.4;
				falling_block.spawn();
			})
			.onHurt(context => ore_hurt(context))
			.onAddedToWorld(entity => ore_spawn(entity))
	})

	e.create("dummy", "entityjs:mob")
		.noEggItem()
		.setRenderType("translucent")
		.sized(0.1, 0)
		.modelSize(0, 0)
		.defaultDeathPose(false)
		.updateInterval(20)
		.showVehicleHealth(() => false)

		.canBreatheUnderwater(true)
		.fireImmune(true)
		.setSoundVolume(0)
		.isPushable(false)
		.isImmobile(() => true)

		.isInvulnerableTo(() => true)
		.canBeAffected(() => false)
		.tick(entity => {
			if(entity.level.isClientSide() || entity.age % 5) return;
			const passenger = entity.getFirstPassenger();
			if(!passenger) entity.discard();
			else passenger.potionEffects.add("farmersdelight:comfort", 6, 0, true, true);
		})
		.onLivingFall(context => {
			const {entity} = context;
			if(entity.level.isClientSide()) return;
			if(entity.tags.contains("sit")) entity.discard();
			else entity.addTag("sit");
        })
})

EntityJSEvents.attributes(e => {
	const ore_map = {
		"kubejs:diamond_ore": [0.5, 6],
		"kubejs:redstone_ore": [0.45, 5],
		"kubejs:deepslate_diamond_ore": [0.6, 8],
		"kubejs:deepslate_redstone_ore": [0.55, 7]
	};
	Object.keys(ore_map).forEach(key => {
		e.modify(key, attribute => {
			const data = ore_map[key];
			attribute.add("minecraft:generic.movement_speed", data[0]);
			attribute.add("minecraft:generic.max_health", data[1]);
			attribute.add("minecraft:generic.armor", 1000);
			attribute.add("generic.knockback_resistance", 1);
		})
	})

	e.modify("kubejs:dummy", attribute => {
		attribute.add("minecraft:generic.movement_speed", 0);
		attribute.add("minecraft:generic.max_health", 1)
	})
})