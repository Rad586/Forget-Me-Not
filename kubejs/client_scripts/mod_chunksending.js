ClientEvents.loggedOut(e => {
    const path = "config/chunksending.json";
    const target_value = Math.ceil(0.36 * Client.options.renderDistance().get() + 0.18);
    if (JsonIO.read(path).maxChunksPerTick.maxChunksPerTick == target_value) return;

    JsonIO.write(path, {
        "maxChunksPerTick": {
            "maxChunksPerTick": target_value,
        }
    })
})