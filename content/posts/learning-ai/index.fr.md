+++
title = "Quelques ressources en IA, et une proposition de parcours pédagogique"
date = 2025-06-19
description = "Quelques liens pour apprendre l'IA aujourd'hui."
draft = false
+++

Mes présentations du lycée mises de côté, mon intérêt pour l'intelligence artificielle (IA) a vraiment commencé en 2017 lorsque j'ai réimplémenté l'algorithme [NEAT (NeuroEvolution of Augmenting Topologies)](https://arxiv.org/abs/1107.0037) en C. J'ai ensuite exploré des concepts plus répandus tels que la rétropropagation et l'apprentissage profond distribué, principalement au travers d'articles scientifiques, notamment pendant la réalisation de mon doctorat. Aujourd'hui, de nombreuses ressources en ligne offrent une excellente introduction à l'apprentissage de l'IA.

Dans cet article, j'ai compilé quelques liens couvrant des sujets comme les aspects moraux et éthiques de l'IA, les travaux pratiques sur la rétropropagation et la réimplémentation d'architectures de modèles, ainsi que l'infrastructure de l'IA. L'IA est un domaine en rapide évolution, et il est facile de se sentir submergé par le volume de travaux publiés chaque semaine. J'ai trouvé que toutes ces ressources sont d'excellente qualité et suffisantes pour couvrir les principaux aspects impliqués dans la gestion des charges IA. Vous devriez probablement les étudier dans l'ordre où elles apparaissent ci-dessous.

L'article [AI as Normal Technology](https://knightcolumbia.org/content/ai-as-normal-technology) est une lecture essentielle pour moi. Il présente une vision de l'IA en contraste avec les visions utopiques et dystopiques, qui traitent souvent l'IA comme une sorte d'espèce distincte—une entité hautement autonome, potentiellement superintelligente. Pourtant, la vision de l'IA comme technologie normale est largement partagée, bien que rarement articulée explicitement. Personnellement, je partage cette vision, que je trouve beaucoup plus raisonnable que celle de la superintelligence.

Plongeons dans le vif du sujet. Une ressource que j'ai trouvée très informative comme première approche à l'apprentissage profond est cet [article de David Louapre sur le grokking](https://scienceetonnante.substack.com/p/grokking-les-modeles-dia-sont-ils). Cet article aide à comprendre le type d'information que les réseaux de neurones peuvent extraire lors de l'apprentissage d'un nouveau problème, et comment cette information est stockée.

Après cette introduction, je vous suggère d'explorer la [chaîne YouTube de Welch Labs](https://www.youtube.com/@WelchLabsVideo/videos), qui explique en détail de nombreux concepts impliqués dans le développement des modèles que nous connaissons aujourd'hui. En particulier, vous devriez regarder les vidéos suivantes :

- [The moment we stopped understanding AI](https://www.youtube.com/watch?v=UZDiGooFs54)
- [The Misconception that Almost Stopped AI](https://www.youtube.com/watch?v=NrO20Jb-hy0)
- [The F=ma of Artificial Intelligence (backpropagation)](https://www.youtube.com/watch?v=VkHfRKewkWw)
- [How DeepSeek Rewrote the Transformer (MLA)](https://www.youtube.com/watch?v=0VLAoVGf_74)

Une fois que vous avez une bonne compréhension de ces concepts, il est temps de les mettre en pratique. Pour cela, je vous recommande de visiter la [chaîne YouTube d'Andrej Karpathy](https://www.youtube.com/@AndrejKarpathy/videos). Sa playlist [Neural Networks: Zero to Hero](https://youtube.com/playlist?list=PLAqhIrjkxbuWI23v9cThsA9GvCAUhRvKZ) est une ressource de haute qualité pour programmer et entraîner votre premier réseau de neurones à partir de zéro, en supposant une connaissance même basique de Python et un vague souvenir d'analyse numérique niveau lycée. Dans les vidéos suivantes, vous aurez l'occasion d'implémenter un modèle de langage travaillant avec des caractères bigrammes, un perceptron multicouche (MLP), ainsi que des Transformers Génératifs Pré-entraînés (GPT) comme GPT-2 et GPT-3. Andrej a une capacité remarquable à distiller et expliquer des sujets complexes.

Pour des sujets plus avancés comme les aspects internes des modèles de langue, les lois d'échelle et la conception d'architectures, le site web [Physics of Language Models](https://physics.allen-zhu.com/) de Zeyuan Allen-Zhu et al. est vraiment une excellente ressource. Les auteurs proposent de diviser le concept d'« intelligence » en plusieurs dimensions telles que les structures, les connaissances, le raisonnement, etc., et conçoivent des expériences contrôlées pour identifier les lois universelles des modèles de langage. Cette ressource m'a permis de consolider mes intuitions sur les modèles de langage, et j'ai vraiment apprécié leur approche rigoureuse inspirée par l'éthologie.

Je me suis spécialisé dans l'apprentissage profond parallèle et distribué, qui permet le passage à l'échelle des charges IA sur de nombreux GPU. Une excellente introduction à ce sujet est le [Ultra-scale Playbook](https://huggingface.co/spaces/nanotron/ultrascale-playbook) écrit par l'équipe Nanotron chez Hugging Face. Leur livre fait un excellent travail en parcourant les connaissances nécessaires pour étendre l'entraînement des grands modèles de langage (LLMs) d'un GPU à des centaines, voire des milliers de GPUs.

Enfin, un aspect clé de l'IA est l'infrastructure d'entraînement des modèles, qui a permis une grande partie des développements récents dans le domaine. Le [dépôt ml-engineering](https://github.com/stas00/ml-engineering) est une collection ouverte de méthodologies, d'outils et d'instructions étape par étape pour aider à l'entraînement et à l'affinage des LLMs et de leur inférence. J'ai particulièrement apprécié la lecture du premier chapitre intitulé [The AI Battlefield Engineering - What You Need To Know](https://github.com/stas00/ml-engineering/blob/master/insights/ai-battlefield.md).

C'est tout pour ma sélection, qui devrait vous occuper pendant de nombreux mois à venir. Si vous bloquez sur un concept trop longtemps, n'hésitez pas à passer au suivant, puis revenez-y après un moment. Tout cela est très dense : la répétition est souvent un bon moyen d'ancrer les connaissances. Profitez du voyage, car il ne se terminera jamais !
