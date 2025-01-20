+++
title = "Je soutiendrai ma thèse le lundi 4 novembre 2024"
date = 2024-10-31
draft = false
+++

Ma soutenance de thèse est programmée le **lundi 4 novembre 2024 à 13h30**. L'évènement se tiendra au labo IRISA/Inria Rennes (en salle Markov), 263 Avenue du Général Leclerc, 35042 Rennes ([maps link](https://www.openstreetmap.org/way/81586498)).

La soutenance sera retransmise en direct, merci de me contacter pour obtenir le lien !

La version revue de mon manuscrit de thèse est disponible: [lien vers mon manuscrit](/papers/phd24.pdf). La thèse est intitulée: “_Distributed Rehearsal Buffers for Continual Learning at Scale_”, ce qui peut être traduit par "_Tampons de Répétition Distribués pour passer l'Apprentissage Continu à l'Échelle_". Le résumé figure en bas de cette page. La soutenance sera en anglais.

# Jury

### Reviewers

- Bruno RAFFIN, Directeur de recherche, Inria, Grenoble, France
- Eddy CARON, Professeur des universités, Université Claude Bernard Lyon 1 (ISFA), France

### Examinateurs

- Ilkay ALTINTAS, Research scientist, University of California San Diego, USA
- Cédric TEDESCHI, Professeur des universités, Université de Rennes, France

### PhD advisors

- Alexandru COSTAN, Maître de conférences, INSA, Rennes, France
- Gabriel ANTONIU, Directeur de recherche, Inria, Rennes, France

# Résumé

Au cours de la dernière décennie, l'apprentissage profond (DL pour _Deep Learning_) a permis l'évolution des systèmes experts vers des modèles statistiques. Les réseaux de neurones profonds (DNN pour _Deep Neural Networks_) ont révolutionné la manière dont les problèmes sont abordés dans de nombreux domaines, grâce à l'extraction de motifs pertinents à partir de jeux de données complexes, mais étiquetés. De la même manière que des ordinateurs plus puissants ont permis de concevoir des réseaux avec beaucoup plus de neurones, les volumes de données d'entrée toujours croissants ont accéléré les avancées dans ce domaine. Des modèles plus grands et des jeux de données centralisés plus importants nécessitent des stratégies distribuées pour tirer parti de plusieurs nœuds de calcul.

La plupart des algorithmes d'apprentissage supervisé existants fonctionnent sous les hypothèses que les données d'entrée sont (1) indépendantes et identiquement distribuées (i.i.d.) et (2) disponibles avant l'entraînement du modèle. Cependant, ces contraintes entravent de nombreux scénarios de la vie réelle, où de tels jeux de données sont remplacés par des flux de données générés au fil du temps par des dispositifs distribués (parfois géographiquement). Il est irréalisable de ré-entraîner le modèle à partir de zéro (en mode _offline_) à chaque fois que de nouvelles données arrivent, car cela entraînerait des contraintes de temps d'entraînement et/ou d'utilisation de ressources prohibitives. De plus, les réseaux de neurones typiques souffrent d'oubli catastrophique dans ce contexte, un phénomène qui les amène à donner plus d'importance aux nouveaux échantillons au détriment des connaissances précédemment acquises (c'est-à-dire un biais en faveur des nouveaux échantillons). Certains auteurs ont montré que les méthodes de répétition de la mémoire sont efficaces pour atténuer la dégradation de la précision dans de tels contextes. Cependant, leurs performances sont encore loin de celles des modèles oracles ayant un accès complet au jeu de données dès le début de l'entraînement. Le problème de l'apprentissage continu (CL pour _Continual Learning_) reste une question de recherche ouverte.

La littérature traite généralement la question de l'apprentissage profond distribué séparément de celle de l'apprentissage continu. Dans cette thèse, nous nous intéressons à la manière dont les méthodes d'apprentissage continu peuvent tirer parti de la parallélisation des données à travers les nœuds, qui est l'une des techniques pour passer l'entraînement à l'échelle sur les systèmes HPC. En instanciant des tampons de répétition distribués, la mémoire agrégée bénéficie à la précision pouvant être atteinte par de tels algorithmes. Les principaux objectifs de recherche de cette thèse sont (1) la conception et la mise en œuvre d'un tampon de répétition exploitant efficacement les systèmes distribués et (2) l'étude des compromis introduits par l'apprentissage continu à grande échelle en termes de temps d'entraînement, de précision et d'utilisation de la mémoire.

Nous validons d'abord les performances et le passage à l'échelle de notre proposition avec une série d'expériences axées sur des problèmes de classification. Nous menons des expériences approfondies utilisant jusqu'à 128 GPU du supercalculateur ThetaGPU pour comparer notre approche avec des références représentatives de l'entraînement à partir de zéro _offline_ (la limite supérieure en terme de précision) et de l'entraînement incrémental (la limite inférieure).

Avec une diversité grandissante des techniques de répétition, il devient important de découpler le tampon de répétition de la tâche d'apprentissage, de sorte qu'il devienne une abstraction générique et réutilisable pouvant stocker des états supplémentaires selon les besoins des algorithmes d'apprentissage continu plus avancés. À cette fin, nous proposons une généralisation des tampons de répétition pour supporter à la fois les tâches de classification et d'apprentissage génératif, ainsi que des stratégies de répétition plus avancées (notamment _Dark Experience Replay_, exploitant la distillation de connaissances). Nous illustrons cette approche avec une application de streaming HPC en temps réel pour la reconstruction d'images ptychographiques.