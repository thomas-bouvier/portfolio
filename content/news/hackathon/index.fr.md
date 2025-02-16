+++
title = "Nous participerons au 5e hackathon HPC/IA organisé par l'IDRIS"
date = 2025-02-16
draft = true
+++

Pour la cinquième année consécutive, l'IDRIS organise, conjointement avec NVIDIA, un [hackathon GPU HPC et IA](https://www.genci.fr/actualites/5e-edition-du-hackathon-gpu-hpc-et-ia-2025-de-lidris). 
L'IDRIS est le centre majeur du CNRS pour le calcul numérique intensif de très haute performance.
Il aura lieu les 20, 21 et 22 mai 2025 (dans les locaux de l'IDRIS à Saclay). Les participants auront à cette occasion accès aux ressources de calcul de l'IDRIS, afin de pouvoir tester du code sur des GPUs récents allant jusqu'aux NVIDIA H100. Nous avons monté une équipe pour y participer. Serez-vous de la partie? 👨‍💻

## Notre projet

Our project aims to implement and optimize the novel BatchTopK activation function [[1]](https://arxiv.org/abs/2412.06410) for neural networks, specifically focusing on kernel optimization for NVIDIA GPUs. BatchTopK, recently introduced in the field of sparse autoencoders (SAEs), offers a more flexible approach to activation sparsity by selecting top activations at the batch level rather than per individual sample, potentially leading to better results. We plan to develop efficient CUDA kernels for the BatchTopK operation, addressing the challenges of parallel computation across both batch and feature dimensions while maintaining numerical stability. Our implementation will leverage Triton [[2]](https://github.com/triton-lang/triton) as a high-level DSL for GPU programming. The implementation will be validated through training SAEs using Nanotron⚡️, and conducting comprehensive benchmarking against standard activation functions (ReLU, TopK), measuring both computational performance and memory efficiency.