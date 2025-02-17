+++
title = "Je vais donner une présentation à JLESC 14 @ Urbana-Champaign"
date = 2022-09-21
draft = false
+++

Je vais présenter notre projet JLESC nommé ["Towards Continual Learning at Scale"](https://jlesc.github.io/projects/continual_learning_project/) ainsi que quelques résultats préliminaires à [JLESC 14](https://publish.illinois.edu/14th-jlesc-workshop/). Le programme est disponible [ici](https://publish.illinois.edu/14th-jlesc-workshop/agenda/). Ce sera ma première présentation donnée aux USA, à l'Université d'Illinois Urbana-Champaign. 😊

## Towards Continual Learning at Scale - Project Kick-off

During the past decade, Deep learning (DL) supported the shift from rule-based systems towards statistical models. Deep Neural Networks (DNNs) are achieving high accuracy on various benchmarks by extracting patterns from complex datasets. Although presenting promising results, most existing supervised learning algorithms operate under the assumptions that the data is (i) i.i.d.; (ii) static; and (iii) available before the training process. These constraints limit their use in real-life scenarios where the aforementioned datasets are replaced by high volume, high velocity data streams generated over time by distributed devices. It is unfeasible to keep training models in an offline fashion from scratch every time new data arrives, as this would lead to prohibitive time and/or resource constraints. At the same time, it is not possible to train learning models incrementally either, due to catastrophic forgetting, a phenomenon causing typical DNNs to reinforce new patterns at the expense of previously acquired knowledge i.e. inducing biases.

In this talk, we will present techniques based on rehearsal to achieve Continual Learning at scale. Rehearsal-based approaches leverage representative samples previously encountered during training to augment future minibatches with. The key novelty we address is how to adopt rehearsal in the context of data-parallel training, which is one of the main techniques to achieve training scalability on HPC systems. The goal is to design and implement a distributed rehearsal buffer that handles the selection of representative samples and the augmentation of minibatches asynchronously in the background. We will discuss trade-offs introduced by such a continual learning setting in terms of training time, accuracy and memory usage.
