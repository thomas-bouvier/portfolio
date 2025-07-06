+++
title = "Kénotron"
date = 2025-07-03
description = "Kénotron is an experimental fork of Nanotron, a minimalistic large language model 4D-parallelism training library with HPC-oriented optimizations."
draft = false
[[resources]]
    text = "Repository"
    link = "https://github.com/korovod/kenotron"
+++

## Motivation

Kénotron is a library for pretraining transformer models at scale. It is a fork of the Nanotron library developed at Hugging Face including additional HPC optimizations. Please have a look at the [repository](https://github.com/korovod/kenotron).

Kénotron is designed to be easy to use, fast, and scalable. It is built with the following principles in mind:

- Simplicity: Kénotron is designed to be easy to use. It provides a simple and flexible API to pretrain models on custom datasets.

- Scalability: Kénotron uses the latest techniques to train models more efficiently at scale.

- Speed: This version of Nanotron focuses on HPC-oriented optimizations, typically made available via C++ extensions.

- Community: the Kénotron project values contributions from the community, PR will actually be reviewed and merged.

Just as Nanotron which is alpha software, do not use Kénotron for production runs. The library is pretty experimental but mature enough for academic work.

## Installation

We recommend using [Spack](https://spack.io/) to install Kénotron, especially if using a supercomputer. Installation instructions are straightforward:

```console
git clone -c feature.manyFiles=true --depth=2 https://github.com/spack/spack.git
git clone https://github.com/korovod/korovod-spack-packages.git
cd spack/bin
./spack repo add korovod-spack-packages
./spack install py-nanotron
```

We advise to maintain a [proper Spack environment]({{% ref "posts/spack-polaris" %}}) to ensure reproducibility.


## Extensions

To install a C++ extension, simply use the corresponding Spack variant as [documented in the README](https://github.com/korovod/kenotron/blob/main/README.md#installation):

```console
./spack install py-nanotron +py-datastates
```

### DataStates-LLM

I will be writing blog posts about the HPC extensions I am currently implementing. An article on the extension [DataStates-LLM](https://github.com/korovod/kenotron/blob/main/examples/datastates/README.md), a lazy asynchronous checkpointing engine for LLMs, is coming soon. I will reference it here once it's ready, so stay tuned!