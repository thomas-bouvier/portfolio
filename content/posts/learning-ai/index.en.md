+++
title = "AI resources and learning path"
date = 2025-06-19
description = "Some pointers on how I would learn AI today."
draft = false
+++

High school presentations aside, my interest in artificial intelligence (AI) truly began in 2017 when I reimplemented the [NEAT (NeuroEvolution of Augmenting Topologies)](https://arxiv.org/abs/1107.0037) algorithm in C (I documented this project on [another page]({{% ref "projects/floppy-bird" %}}) if you're curious). I then explored more widespread concepts such as backpropagation and distributed deep learning, primarily through scientific papers, especially during my PhD. Today, numerous online resources provide an excellent introduction to learning AI.

In this short article, I have compiled a few links covering topics like moral and ethical aspects of AI, practical work on backpropagation and reimplementation of model architectures, and AI infrastructure. AI is a fast-moving field, and it's easy to get overwhelmed by the sheer volume of work published weekly. I found all these resources to be of excellent quality and sufficient to cover the main aspects involved in managing AI workloads. You should probably study them in the order they appear below.

The article [AI as Normal Technology](https://knightcolumbia.org/content/ai-as-normal-technology) is an absolute must-read for me. It presents a vision of AI in constrast to both utopian and dystopian visions, which often treat AI as a separate species—a highly autonomous, potentially superintelligent entity. Yet, the vision of AI as normal technology is widely held, though rarely articulated explicitly. Personally, I share this vision, which I find much more reasonable than the superintelligent one.

Let's dive into the core content. One resource I found insightful as a first high-level approach to deep learning is this [article by David Louapre on grokking](https://scienceetonnante.substack.com/p/grokking-les-modeles-dia-sont-ils) (in French only). This article helps understanding the kind of information neural networks might extract when learning a new problem, and how this information is stored.

After this introduction, I suggest you explore the [Welch Labs YouTube channel](https://www.youtube.com/@WelchLabsVideo/videos), which explains in great detail many concepts involved in building the models as we know today. In particular, you should watch the following videos:

- [The moment we stopped understanding AI](https://www.youtube.com/watch?v=UZDiGooFs54)
- [The Misconception that Almost Stopped AI](https://www.youtube.com/watch?v=NrO20Jb-hy0)
- [The F=ma of Artificial Intelligence (backpropagation)](https://www.youtube.com/watch?v=VkHfRKewkWw)
- [How DeepSeek Rewrote the Transformer (MLA)](https://www.youtube.com/watch?v=0VLAoVGf_74)

Once you have a good grasp of these concepts, it's time to put them into practice. For this, I recommend visiting the [YouTube channel of Andrej Karpathy](https://www.youtube.com/@AndrejKarpathy/videos). His [Neural Networks: Zero to Hero](https://youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ) playlist is a high-quality resource for programming and training your first neural network from scratch, assuming basic knowledge of Python and a vague recollection of calculus from high school. In further videos, you will have the chance to implement a bigram character-level language model, a multilayer perceptron (MLP) character-level language model, as well as Generatively Pretrained Transformers (GPT) like GPT-2 and GPT-3. Andrej has an outstanding ability to distill and explain complex topics. Here are my implementations:

- [A tiny Autograd engine](https://github.com/thomas-bouvier/micrograd)
- [An autoregressive character-level language model](https://github.com/thomas-bouvier/makemore)
- [A self-attention encoder-only transformer](https://github.com/thomas-bouvier/transformer)
- [Training/finetuning medium-sized GPTs](https://github.com/thomas-bouvier/distributed-gpt2)

For more advanced topics like the internals of language models, scaling laws, and architecture design, the website [Physics of Language Models](https://physics.allen-zhu.com/) by Zeyuan Allen-Zhu et al. is truly an excellent resource. The authors propose dividing the concept of "intelligence" into multiple dimensions such as structures, knowledge, reasoning, etc., and design controlled experiments to identify universal laws of language models. This resource enabled me to consolidate my intuitions about language models, and I really appreciated their rigorous approach, inspired by ethology.

I specialized in parallel and distributed deep learning, which enables the scalability of AI workloads on many GPUs. A great introduction to this topic is the [Ultra-scale Playbook](https://huggingface.co/spaces/nanotron/ultrascale-playbook) written by the Nanotron team at Hugging Face. Their book does a good job of walking through the knowledge necessary to scale the training of large language models (LLMs) from one GPU to hundreds, and even thousands of GPUs.

Finally, a key aspect of AI is model training infrastructures, which have enabled much of the recent development in the field. The [ml-engineering repository](https://github.com/stas00/ml-engineering) is an open collection of methodologies, tools and step by step instructions to help with successful training and fine-tuning of LLMs and their inference. I particularly enjoyed reading the first chapter entitled [The AI Battlefield Engineering - What You Need To Know](https://github.com/stas00/ml-engineering/blob/master/insights/ai-battlefield.md).

That's all for my selection, which should keep you busy for many months to come. If you get stuck on a concept for too long, feel free to move on to the next one, then come back to it after a while. All this is very dense: repetition is often a good way of anchoring knowledge. Enjoy the journey, as it will never end!
