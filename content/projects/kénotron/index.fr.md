+++
title = "Kénotron"
date = 2025-07-03
description = "Kénotron est un fork expérimental de Nanotron, une bibliothèque minimaliste d'entraînement de grands modèles de langage avec des optimisations orientées HPC et parallélisme 4D."
draft = false
[[resources]]
    text = "Dépôt"
    link = "https://github.com/korovod/kenotron"
+++

## Motivation

Kénotron est une bibliothèque pour le pré-entraînement de modèles transformers à grande échelle. Il s'agit d'un fork de la bibliothèque Nanotron développée à Hugging Face, qui inclue des optimisations HPC supplémentaires. Le dépôt GitHub est disponible [ici](https://github.com/korovod/kenotron).

Kénotron est conçu pour être facile à utiliser, rapide et évolutif. Il est construit avec les principes suivants à l'esprit :

- Simplicité : Kénotron est conçu pour être facile à utiliser. Il fournit une API simple et flexible pour pré-entraîner des modèles sur des jeux de données personnalisés.

- Passage à l'échelle : Kénotron utilise les dernières techniques pour entraîner des modèles plus efficacement à grande échelle.

- Optimisations : Cette version de Nanotron se concentre sur des optimisations orientées HPC, généralement disponibles via des extensions C++.

- Communauté : le projet Kénotron encourage les contributions de la communauté, les PR seront examinées et mergées.

Tout comme Nanotron, qui est un logiciel en version alpha, Kénotron ne devrait pas être utilisé en production. La bibliothèque est expérimentale mais suffisamment mature pour un travail académique.

## Installation

Nous recommandons d'utiliser [Spack](https://spack.io/) pour installer Kénotron, surtout si vous utilisez un supercalculateur. Les instructions d'installation sont simples :

```console
git clone -c feature.manyFiles=true --depth=2 https://github.com/spack/spack.git
git clone https://github.com/korovod/korovod-spack-packages.git
cd spack/bin
./spack repo add korovod-spack-packages
./spack install py-nanotron
```

Nous conseillons de maintenir un [environnement Spack](https://spack.readthedocs.io/en/latest/environments.html) pour assurer la reproductibilité.


## Extensions

Pour installer une extension C++, utilisez simplement la variante Spack correspondante comme [documenté dans le README](https://github.com/korovod/kenotron/blob/main/README.md#installation):

```console
./spack install py-nanotron +py-datastates
```

### DataStates-LLM

Je vais écrire des articles de blog sur les extensions HPC que je suis en train d'implémenter. Un article sur l'extension [DataStates-LLM](https://github.com/korovod/kenotron/blob/main/examples/datastates/README.md), un moteur de checkpointing asynchrone paresseux pour les LLMs, arrive bientôt. Je le référencerai ici une fois qu'il sera prêt !
