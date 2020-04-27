---
title: "Floppy Bird"
date: 2017-05-31
description: "Floppy Bird takes over the gameplay of the famous Flappy Bird, while integrating two artificial intelligence algorithms: Q-learning and a NEAT-type neural network."
repository: https://github.com/thomas-bouvier/floppy-bird
tags: ["AI", "C"]
draft: false
---

# What's Floppy Bird?

Floppy Bird initially was a school project: it had to be written in C and to respect the MVC architecture. We were 5 developers, with various programming experience.

The first step was to reproduce the famous [Flappy Bird](https://en.wikipedia.org/wiki/Flappy_Bird) game using the [SDL library](https://www.libsdl.org). Then, we added 2 artifical intelligences: the first one relied on Q-learning where the second one was a neural network. Finally, we wanted to implement these 2 algorithms on a physical robot with a stylus and a camera, so it could play alone on a tablet. This last step also involved image processing.

# What I did

I focused on the development of the second artificial intelligence, which is based on a neural network. Introduced to this field by [this video](https://www.youtube.com/watch?v=qv6UVOQ0F44), I decided to implement a [NEAT](https://en.wikipedia.org/wiki/Neuroevolution_of_augmenting_topologies) algorithm.

This algorithm is based on applying three key techniques: tracking genes with history markers to allow crossover among genomes (<em>i.e.</em> neural networks), applying speciation to preserve successful innovations, and developing genomes incrementally from simple initial structures by adding noise.

Each generation simulates 50 genomes. The following video demonstrates the process at generations #10, #11 and #12:

{{< video lnHJ70OcNX8 "NEAT-based AI at work: generations #10, #11 and #12" >}}

The generated neural networks can be visualized using [Graphviz](http://www.graphviz.org).

I also wrote many unit tests using [cmocka](https://cmocka.org), and learned about software quality in general (documentation using [Doxygen](http://www.stack.nl/~dimitri/doxygen), code coverage using [Gcov](https://gcc.gnu.org/onlinedocs/gcc/Gcov.html). Also, we defined a Git branch strategy adapted to our small team.

The [repository](https://github.com/thomas-bouvier/floppy-bird) is hosted on Github.

# Results

The scores obtained with the NEAT algorithm are very satisfaying: about 200 after only 20 generations in the best case scenario. It arrives at these scores in much less time than with the Q-learning approach. 👌

However, the generated genomes regularly become less efficent than the ones from the previous generation, for a reason I don't understand yet. This causes the score to get back to 0. I still have to investigate.

Concerning the implementation on the robot, it doesn't work as well as we expected. This is caused by latencies related to image processing and stylus stroke. We have an idea to fix this.
