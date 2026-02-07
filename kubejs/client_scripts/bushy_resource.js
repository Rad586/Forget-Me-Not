function state_leaves(bushy, color, type) {
    const path = `kubejs/assets/kubejs/blockstates/${color}_${type}_leaves.json`;
    const a = `block/leaves/${type}_leaves_0`;
    const b = `block/leaves/${type}_leaves_1`;
    if (bushy) {
        JsonIO.write(path,
            {
                "variants": {
                    "": [
                        { "model": a },
                        { "model": b },
                        { "model": a, "y": 90 },
                        { "model": b, "y": 90 },
                        { "model": a, "y": 180 },
                        { "model": b, "y": 180 },
                        { "model": a, "y": 270 },
                        { "model": b, "y": 270 }
                    ]
                }
            }
        )
    }
    else {
        JsonIO.write(path, "")
    }
};
const leaf_colors = [
    "pink", "blue", "purple", "white",
    "yellow", "orange", "red", "gray",
    "light_blue", "light_gray", "black",
    "cyan", "magenta", "lime", "brown",
    "green"
];
const leaf_types = [
    "oak", "birch", "dark_oak", "acacia",
    "jungle", "mangrove", "spruce"
];
ClientEvents.highPriorityAssets(e => {
    const bushy = Client.options.resourcePacks.find(r => r == "file/xalis_bushy_leaves_edited") != null;
    leaf_colors.forEach(color => {
        leaf_types.forEach(type => {
            state_leaves(bushy, color, type)
        })
    })
})