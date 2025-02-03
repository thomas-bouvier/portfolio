+++
title = "I will be defending my PhD on Monday, November 4th, 2024"
date = 2024-10-31
draft = false
+++

My PhD defense is scheduled for **Monday, November 4th, 2024, at 1:30 pm**. The event will take place at IRISA/Inria Rennes (Markov room), 263 Avenue du Général Leclerc, 35042 Rennes ([maps link](https://www.openstreetmap.org/way/81586498)).

It will also be broadcast live, please get in touch to get the link!

The reviewed dissertation of my thesis can be found here: [link to dissertation](/papers/phd24.pdf). It is entitled: “_Distributed Rehearsal Buffers for Continual Learning at Scale_”. The abstract can be found at the bottom of this page. The presentation will be in English.

## Jury

### Reviewers

- Bruno RAFFIN, Directeur de recherche, Inria, Grenoble, France
- Eddy CARON, Professeur des universités, Université Claude Bernard Lyon 1 (ISFA), France

### Examinators

- Ilkay ALTINTAS, Research scientist, University of California San Diego, USA
- Cédric TEDESCHI, Professeur des universités, Université de Rennes, France

### PhD advisors

- Alexandru COSTAN, Maître de conférences, INSA, Rennes, France
- Gabriel ANTONIU, Directeur de recherche, Inria, Rennes, France

## Abstract

During the past decade, Deep learning (DL) supported the shift from rule-based systems towards statistical models. Deep Neural Networks (DNNs) revolutionized how we address problems in a wide range of applications by extracting patterns from complex yet labelled datasets. In the same way that more-powerful computers made it possible to design networks with vastly more neurons, ever-growing volumes of data act as a driving force for advancements in this field. Bigger models and larger centralized datasets demand for distributed strategies to leverage multiple compute nodes.

Most existing supervised learning algorithms operate under the assumptions that the data is (1) independent and identically distributed (i.i.d.) and (2) available before the training process. However, these constraints stand in the way of many real-life scenarios where the aforementioned datasets are replaced by high volume, high velocity data streams generated over time by distributed (sometimes geographically) devices. It is unfeasible to keep training the models in an offline fashion from scratch every time new data arrives, as this would lead to prohibitive time and/or resource constraints. Also, typical DNNs suffer from catastrophic forgetting in this context, a phenomenon causing them to reinforce new patterns at the expense of previously acquired knowledge (i.e., a bias towards new samples). Some authors have shown that memory rehearsal methods are effective in mitigating accuracy degradation in such settings. However, their performance is still far from that of oracles with full access to the static dataset. The problem of Continual Learning (CL) remains an open research question.

Existing research typically addresses distributed DL and CL separately. In this dissertation, we are interested in how CL methods can take advantage of data parallelization across nodes, which is one of the main techniques to achieve training scalability on HPC systems. The aggregated memory could benefit the accuracy achieved by such algorithms by instantiating distributed rehearsal buffers. The main research goals of this dissertation are the (1) design and implementation of a rehearsal buffer leveraging distributed systems effectively and the (2) study of trade-offs introduced by large-scale CL in terms of training time, accuracy and memory usage.

We first validate the performance and scalability of our proposal with a series of experiments focusing on classification problems. We ran extensive experiments on up to 128 GPUs of the ThetaGPU supercomputer to compare our approach with baselines representative of training-from-scratch (the upper bound in terms of accuracy) and incremental training (the lower bound).

With a growing diversity of rehearsal techniques, it becomes important to decouple the rehearsal buffer from the learning task, such that it becomes a generic, reusable abstraction that can store additional state information as needed by more advanced rehearsal-based CL algorithms. To this end, we propose a generalization of rehearsal buffers to support both classification and generative learning tasks, as well as more advanced rehearsal strategies (notably dark experience replay, leveraging knowledge distillation). We illustrate this approach with a real-life HPC streaming application from the domain of ptychographic image reconstruction.