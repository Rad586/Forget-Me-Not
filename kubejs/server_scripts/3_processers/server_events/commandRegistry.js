ServerEvents.commandRegistry(e => {
	const { commands: Commands } = e;
	const { toggles } = global;

	const StringArgumentType = Java.loadClass("com.mojang.brigadier.arguments.StringArgumentType");
	const BoolArgumentType = Java.loadClass("com.mojang.brigadier.arguments.BoolArgumentType");

	e.register(
		Commands.literal("toggle")
			.requires(src => src.hasPermission(2))
			.then(
				Commands.argument("name", StringArgumentType.word())
					.suggests((ctx, builder) => {
						Object.keys(toggles).forEach(k => builder.suggest(k));
						return builder.buildFuture();
					})
					.then(
						Commands.argument("value", BoolArgumentType.bool())
							.executes(c => {
								const { server, level, player } = c.source;
								const name = StringArgumentType.getString(c, "name");
								const value = BoolArgumentType.getBool(c, "value");

								toggles[name](server, level, player, value);
								server.tell([
									player.username,
									Text.translate(`dialogue.fmn.${name}`),
									value
								]);

								return 1
							})
					)
			)
	)

	e.register(Commands.literal("togglePickup")
		.requires(src => src.hasPermission(1))
		.executes(c => {
			const { player } = c.source, {persistentData: pData} = player;
			const {auto_pickup} = pData, status = !(auto_pickup == null ? true : auto_pickup);
			pData.auto_pickup = status;
			player.sendData("auto_pickup", {status: status});
			return 1
		}))

	e.register(Commands.literal("rollArmorSet")
		.requires(src => src.hasPermission(1))
		.executes(c => {
			const { player } = c.source, { persistentData: pData } = player;
			const { armor_sets, sets_i } = pData;

			const new_set = [];
			player.armorSlots.forEach(a => new_set.push(a));
			pData.armor_sets[sets_i] = new_set.reverse();

			const i = sets_i == 2 ? 0 : sets_i + 1;
			const next_set = armor_sets[i];
			pData.sets_i = i

			const s0 = next_set[0], s1 = next_set[1],
				s2 = next_set[2], s3 = next_set[3];
			player.setHeadArmorItem(Item.of(s0.id, s0.tag));
			player.setChestArmorItem(Item.of(s1.id, s1.tag));
			player.setLegsArmorItem(Item.of(s2.id, s2.tag));
			player.setFeetArmorItem(Item.of(s3.id, s3.tag));

			player.sendData("armor_set", { num: i })

			return 1
		}))

	/* credit: FalAut(https://discord.com/channels/303440391124942858/1257504502777380875) */
	e.register(Commands.literal("openCraftingMenu")
		.requires(src => src.hasPermission(1))
		.executes(c => {
			const { player, level } = c.source;

			player.openMenu(new SimpleMenuProvider((i, inv, p) =>
				new CraftingMenu(i, inv, (func) => {
					func.apply(level, player.blockPosition());
					return Optional.empty();
				}),
				Text.translate("container.crafting")
			));

			return 1
		}))

	e.register(Commands.literal("openInventory")
		.requires(src => src.hasPermission(1))
		.executes(c => {
			c.source.player.sendData("open_inv");
			return 1
		}))
})