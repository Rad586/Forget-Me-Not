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
})