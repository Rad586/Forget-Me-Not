StartupEvents.registry("entity_type", e => {
	e.create("dynamite", "entityjs:projectile")
		.item(item => item.canThrow(true))
		.sized(0.4, 0.4)
		.renderScale(0.4, 0.4, 0.4)

		.tick(entity => {
			const { level } = entity;
			if (level.isClientSide()) return;
			global.particleBurst(level, entity, "smoke", 2, 0.03);
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
			const { level } = entity;
			if (level.isClientSide()) return;
			global.particleBurst(level, entity, "small_flame", 2, 0.03)
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
			const { level } = entity;
			if (level.isClientSide()) return;

			global.particleBurst(level, entity, "smoke", 2, 0.03);
			if (entity.isOnFire()) explosive_arrow(entity, 1.5)
		})
		.onHitEntity(context => explosive_arrow(context.entity, 1))
		.onHitBlock(context => explosive_arrow(context.entity, 2))

	e.create("hook_arrow", "entityjs:arrow")
		.sized(1, 1)
		.setBaseDamage(0)

		.tick(entity => {
			const { level } = entity;
			if (level.isClientSide()) return;

			global.particleBurst(level, entity, "end_rod", 1);
		})
		.onHitEntity(context => hook_arrow(context))
		.onHitBlock(context => hook_arrow(context))

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

	function attack(player, target, damage) {
		target.invulnerableTime = 0;
		target.attack(player, damage);
	}
	function attackable(player, target) {
		if (target &&
			target.isLiving() &&
			target.isAlive() &&
			target != player &&
			target.owner != player
		) return true;

		if (target instanceof Projectile && target.type != "kubejs:arc") {
			target.playSound("fmn:destroy_projectile", 0.3, 1);
			target.level.spawnParticles(
				"large_smoke", false,
				target.x, target.y + 0.2, target.z,
				0.1, 0.12, 0.1,
				2, 0.06
			);
			target.discard()
		};

		return false
	}
	const hit_criteria = (center, player, target, range) => (
		target &&
		target != player &&
		target.distanceToEntity(center) <= range &&
		player.hasLineOfSight(target) &&
		attackable(player, target)
	)
	function areaCheck(center, level, player, range, func) {
		const { x, eyeY, z } = center;
		const aabb = AABB.of(x, eyeY, z, x, eyeY, z).inflate(range, 1, range);
		const entities = level.getEntitiesWithin(aabb)
			.filter(target => hit_criteria(center, player, target, range));

		if (entities.isEmpty()) return;
		entities.forEach(target => func(target))
	}
	const type_map = {
		"nope": (level, player, hit, cd, damage, lvl) => {
			attack(player, hit, damage)
		},
		"whirlwind": (level, player, hit, cd, damage, lvl) => { 
			const range = 1 + (lvl - 1) * 0.5;

			areaCheck(hit, level, player, range, (target) => {
				attack(player, target, damage)
			})
		},
		"vortex": (level, player, hit, cd, damage, lvl) => { 
			const range = 1.5 + (lvl - 1) * 0.5;

			attack(player, hit, damage);
			areaCheck(hit, level, player, range, (target) => {
				const target_pos = target.eyePosition;
				const visible = player.getViewVector(1)
					.dot(target_pos.subtract(player.eyePosition)) > 0;

				if (!visible) return;
				target.setDeltaMovement(
					hit.eyePosition.subtract(target_pos)
						.scale(0.1)
						.add(0, 0.15, 0)
				);
				target.hurtMarked = true
			});

			global.particleRing(level, range * 2, range, hit, "poof", -0.1 * range, -0.1)
		},
		"inferno": (level, player, hit, cd, damage, lvl) => { 
			const range = 1 + (lvl - 1) * 0.5;

			areaCheck(hit, level, player, range, (target) => {
				if (!target.isOnFire()) {
					if (target.block.hasTag("minecraft:soul_fire_base_blocks")) {
						target.fireType = "minecraft:soul"
					};
					target.setSecondsOnFire(cd / 20 + 1.2)
				}
				else {
					attack(player, target, damage);
					target.extinguish()
				}
			});
			attack(player, hit, damage);

			global.particleRingVertical(level, range * 3, range, hit, "lava", 0.2, -0.1)
		},
		"blizzard": (level, player, hit, cd, damage, lvl) => { 
			const range = 1.5 + (lvl - 1) * 1;

			areaCheck(hit, level, player, range, (target) => {
				const { potionEffects } = target;

				if (!target.hasEffect("slowness")) {
					potionEffects.add("slowness", cd + 30, 0, false, true)
				}
				else {
					potionEffects.add("slowness", damage * 20 / 2, 1, false, true)
				}
			});
			attack(player, hit, damage);

			global.particleRingVertical(level, range * 2, range, hit, "snowflake", 0.4, -0.1);
		},
		"lunge": (level, player, hit, cd, damage, lvl) => { 
			const range = 1.5;

			areaCheck(hit, level, player, range, (target) => {
				const { lookAngle: m } = player;

				target.setDeltaMovement(new Vec3(
					m.x(), 
					Math.min(0.4, m.y()), 
					m.z()).scale(0.75 + (lvl - 1) * 0.25));
				target.hurtMarked = true;
			});
			attack(player, hit, damage)
		},
	}
	e.create("arc", "entityjs:projectile")
		.noItem()
		.sized(0.4, 0.4)
		.renderScale(0, 0, 0)
		.textureLocation(() => "kubejs:textures/entity/dummy.png")

		.tick(entity => {
			const { level, age } = entity;
			if (level.isClientSide() || age % 3) return;

			level.spawnParticles(
				"sweep_attack", true,
				entity.x, entity.y, entity.z,
				0, 0, 0,
				1, 0
			);
			if(age > 4) entity.discard();
		})
		.onHitEntity(context => {
			const { entity } = context, { level } = entity;
			if (level.isClientSide()) return;

			const { owner } = entity;
			if (owner) {
				let hit = context.result.entity;
				let pData = entity.persistentData;
				let { damage, cd, type, lvl } = pData;

				type_map[type || "nope"](level, owner, hit, cd, damage, lvl)
			};
			entity.discard();

			global.particleBurst(level, entity, "crit", 3, 0.5, 0, 0.2);
			entity.playSound("fmn:destroy_projectile", 0.3, 1)
		})
		.onHitBlock(context => {
			const { entity } = context, { level } = entity;
			if (level.isClientSide()) return;

			level.spawnParticles(
				"large_smoke", false,
				entity.x, entity.y + 0.2, entity.z,
				0.1, 0.12, 0.1,
				2, 0.06
			);
			entity.playSound("fmn:destroy_projectile", 0.3, 1);

			entity.discard()
		})
})