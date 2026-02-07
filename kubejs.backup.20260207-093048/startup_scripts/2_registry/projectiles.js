StartupEvents.registry("entity_type", e => {
	e.create("dynamite", "entityjs:projectile")
		.item(item => item.canThrow(true))
		.sized(0.4, 0.4)
		.renderScale(0.4, 0.4, 0.4)

		.tick(entity => {
			if(entity.level.isClientSide()) return;
			global.particleBurst(entity, "smoke", 2, 0.03);
		})
		.onHitEntity(context => dynamite_entity(context.entity))
		.onHitBlock(context => dynamite_block(context.entity, context.result))

	/* Idea from MikhailTapio(https://www.curseforge.com/minecraft/mc-mods/throwableslimeball) */
	e.create("slime_ball", "entityjs:projectile")
		.noItem()
		.sized(0.5, 0.5)
		.renderScale(0.5, 0.5, 0.5)
		.textureLocation(() => "minecraft:textures/item/slime_ball.png")

		.onHitEntity(context => slime_ball_entity(context.entity, context.result))
		.onHitBlock(context => slime_ball_block(context.entity, context.result.direction))

	e.create("sticky_torch", "entityjs:projectile")
		.item(item => item.canThrow(true))
		.sized(0.5, 0.5)
		.renderScale(0.5, 0.5, 0.5)

		.tick(entity => {
			if(entity.level.isClientSide()) return;
			global.particleBurst(entity, "small_flame", 2, 0.03)
		})
		.onHitEntity(context => stick_torch_entity(context.entity, context.result.entity))
		.onHitBlock(context => stick_torch_block(context.entity, context.result))

	e.create("sticky_ender_pearl", "entityjs:projectile")
		.item(item => item.canThrow(true))
		.sized(0.5, 0.5)
		.renderScale(0.5, 0.5, 0.5)

		.onHitEntity(context => sticky_ender_pearl_entity(context.entity, context.result.entity))
		.onHitBlock(context => sticky_ender_pearl_block(context.entity, context.result))

	e.create("magic", "entityjs:projectile")
		.noItem()
		.sized(0.4, 0.4)
		.renderScale(0, 0, 0)
		.textureLocation(() => "kubejs:textures/entity/dummy.png")

		.tick(entity => magic_tick(entity))
		.onHitEntity(context => magic_entity(context))
		.onHitBlock(context => magic_block(context))

	e.create("falling_star", "entityjs:projectile")
		.noItem()
		.sized(0.4, 0.4)
		.renderScale(0, 0, 0)
		.textureLocation(() => "kubejs:textures/entity/dummy.png")

		.tick(entity => falling_star_tick(entity))
		.onHitEntity(context => falling_star_entity(context))
		.onHitBlock(context => falling_star_block(context))

	e.create("recovery_pearl", "entityjs:projectile")
		.sized(0.5, 0.5)
		.renderScale(0.5, 0.5, 0.5)
		.item(item => item.canThrow(true).tooltip(Text.translate("dialogue.fmn.recovery_pearl")))

		.onHitEntity(context => recovery_pearl(context.entity))
		.onHitBlock(context => recovery_pearl(context.entity))

	e.create("explosive_arrow", "entityjs:arrow")
		.sized(1, 1)
		.setBaseDamage(0)

		.tick(entity => {
			if(entity.level.isClientSide()) return;
			global.particleBurst(entity, "smoke", 2, 0.03);
			if(entity.isOnFire()) global.test(entity, 1.5);
		})
		.onHitEntity(context => explosive_arrow(context.entity, 1))
		.onHitBlock(context => explosive_arrow(context.entity, 2))

	e.create("hook_arrow", "entityjs:arrow")
		.sized(1, 1)
		.setBaseDamage(0)

		.tick(entity => {
			if(entity.level.isClientSide()) return;
			global.particleBurst(entity, "end_rod", 1);
		})
		.onHitEntity(context => hook_arrow(context))
		.onHitBlock(context => hook_arrow(context))

	e.create("phantom_fireball", "entityjs:projectile")
		.noItem()
		.sized(1, 1)
		.renderScale(1.2, 1.2, 1.2)

		.onHitEntity(context => phantom_fireball(context.entity))
		.onHitBlock(context => phantom_fireball(context.entity))

	e.create("explosion_fireball", "entityjs:projectile")
		.noItem()
		.sized(1, 1)
		.renderScale(1.2, 1.2, 1.2)

		.onHitEntity(context => explosion_fireball(context.entity))
		.onHitBlock(context => explosion_fireball(context.entity))

	e.create("repulsion_fireball", "entityjs:projectile")
		.noItem()
		.sized(1, 1)
		.renderScale(1.2, 1.2, 1.2)

		.onHitEntity(context => repulsion_fireball(context.entity))
		.onHitBlock(context => repulsion_fireball(context.entity))

	e.create("pull_fireball", "entityjs:projectile")
		.noItem()
		.sized(1, 1)
		.renderScale(1.2, 1.2, 1.2)

		.onHitEntity(context => pull_fireball(context.entity))
		.onHitBlock(context => pull_fireball(context.entity))

	e.create("dragon_breath", "entityjs:projectile")
		.noItem()
		.sized(0.4, 0.4)
		.renderScale(0, 0, 0)
		.textureLocation(() => "kubejs:textures/entity/dummy.png")

		.tick(entity => dragon_breath_tick(entity))
		.onHitEntity(context => dragon_breath(context))
		.onHitBlock(context => dragon_breath(context))

	e.create("powder", "entityjs:projectile")
		.noItem()
		.sized(0.75, 0.75)
		.renderScale(0, 0, 0)
		.textureLocation(() => "kubejs:textures/entity/dummy.png")

		.tick(entity => powder_tick(entity))
		.onHitEntity(context => powder_entity(context))
		.onHitBlock(context => powder_block(context))
		.isInvulnerableTo(context => powder_onfire(context.entity))
})