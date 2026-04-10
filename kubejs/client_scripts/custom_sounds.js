ClientEvents.highPriorityAssets(e => {
    const content = {};
    global.custom_sounds.forEach(sound => {
        content[sound] = {
            "sounds": [
                {
                    "name": `fmn:${sound}`,
                    "volume": 1,
                    "pitch": 1.06
                },
                {
                    "name": `fmn:${sound}`,
                    "volume": 1,
                    "pitch": 0.94
                },
                {
                    "name": `fmn:${sound}`,
                    "volume": 1,
                    "pitch": 1
                }
            ]
        }
    });

    e.add("fmn:sounds", content)
})