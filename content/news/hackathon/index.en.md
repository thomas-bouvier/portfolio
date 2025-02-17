+++
title = "We will participate in the 5th GPU hackathon HPC/IA organized by IDRIS"
date = 2025-02-16
draft = false
+++

For the fifth consecutive year, the IDRIS is organizing, in collaboration with NVIDIA, an [HPC/AI hackathon](https://www.genci.fr/actualites/5e-edition-du-hackathon-gpu-hpc-et-ia-2025-de-lidris). It will take place on May 20th, 21st, and 22nd, 2025 at the IDRIS facilities in Saclay. Participants will have access to IDRIS's computing resources, allowing them to test code on the latest GPUs, including the NVIDIA H100. So we've put together a team to take part. Will you be there? 👨‍💻

## What we'll try to achieve

Our project aims to implement and optimize the novel BatchTopK activation function [[1]](https://arxiv.org/abs/2412.06410) for neural networks, specifically focusing on kernel optimization for NVIDIA GPUs. BatchTopK, recently introduced in the field of sparse autoencoders (SAEs), offers a more flexible approach to activation sparsity by selecting top activations at the batch level rather than per individual sample, potentially leading to better results. We plan to develop efficient CUDA kernels for the BatchTopK operation, addressing the challenges of parallel computation across both batch and feature dimensions while maintaining numerical stability. Our implementation will leverage Triton [[2]](https://github.com/triton-lang/triton) as a high-level DSL for GPU programming. The implementation will be validated through training SAEs using Nanotron⚡️, and conducting comprehensive benchmarking against standard activation functions (ReLU, TopK), measuring both computational performance and memory efficiency.