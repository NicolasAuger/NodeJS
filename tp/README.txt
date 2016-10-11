TP Marvel API en NODE JS

Lancer le programme en tapant la commande "marvel"
Cela va display les commandes possibles (-c, -m et -d)

-c display les 100 premiers heros de marvel
-d display ce que contient la bdd (remplir avant de l'utliser)
-m demande de choisir un nom de hero (ex : daredevil, spider-man, wolverine, hulk etc...)
    - Si c'est bon, le programme se déroulera et vous pourrez choisir ce que vous désirez découvrir à propos du héro
    - Si le hero n'est pas retrouvé dans l'api, vous serez invité à retenter la saisie

A chaque fois que vous ferez marvel -m et choisirez un hero, cela enregistrera dans un fichier portant son nom:
    - Id du hero
    - Nom du hero
    - Description du hero

Et a chaque fois que vous ferez marvel -m et choisirez un hero, cela enregistrera son nom dans la bdd (marvel.db)

C'est tout il me semble.

PS : Toujours lancer index.js, index_old_non_opti.js est une ancienne version
 ne gérant pas l'erreur qui survient si le hero n'est pas trouvé dans l'api
 De plus le fichier old était mal optimisé (manque de fonctions etc..)

 Bien à vous,
