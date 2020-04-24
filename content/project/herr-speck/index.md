---
title: "Herr Speck"
description: "Herr Speck is a small tile-based game with random world generation and a dynamic light engine."
repository: https://github.com/thomas-bouvier/herr-speck
---

# What's Herr Speck?

Herr Speck is a game I started to work on when I was still in high school, back in 2013. I haven't used any graphical library. This was my first project of this magnitude, and it has been my Java test lab for a long time. In particular, I have been using it to practise OOP concepts.
      
You play a character evolving in randomly generated caves, and you own a gun to defend yourself against bats. Nothing more.

This game is freely inspired by [Catacomb Snatch](https://catacombsnatch.net). [This article](https://mojang.com/2012/02/how-to-use-the-catacomb-snatch-source-code) by Jens Bergensten certainly influenced me.

# What I did

Players love it when they get unpredictable content each time they play: that's why I first developed a random cave generator. The algorithm I used is a [cellular automaton](https://en.wikipedia.org/wiki/Cellular_automaton) - a grid of cells governed by certain rules, similarly to the [game of life](https://en.wikipedia.org/wiki/Conway%27s_Game_of_Life).

The transition rules can be applied multiple times. The seed, the cells frequency or the birth and death thresholds are customizable. I am also able to remove disconnected caverns and to place random entrances.

{{< image src="images/generator.png" title="The cave generator UI" >}}

The game also supports custom tilemaps drawn using [Tiled](http://www.mapeditor.org).

To select the appropriate tile from the spritesheet within generated levels, I used a technique called [tile bitmasking](https://gamedevelopment.tutsplus.com/tutorials/how-to-use-tile-bitmasking-to-auto-tile-your-level-layouts--cms-25673). This ensures that the act of placing these tiles is quick and efficient. Levels contain two layers: the ground and walls.

The game handles collisions, z-ordering and contains several animations. Here is a short gameplay:

{{< youtube bLzYZjrDnBM >}}

I spent entire afternoons drawing all the sprite variations. Doesn't that remind you of Pokemon? 🙂
