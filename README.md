# Little Piano

Dieses Projekt ist mein Beitrag zu [Coding da Vinci](http://codingdavinci.de/). Ich hatte zehn Wochen vom 25. April bis 5. Juli 2015 zeigt gehabt diesen Prototypen zu entwickeln.

# Zusammenfassung

Das Spielprinzip ist bekannt, denn man sieht es täglich in Bus und Bahn: Fleißig werden Zuckerdrops und bunte Bonbons zu 3er-, 4er- oder 5er-Kombinationen zusammengeschoben, um sich die Zeit zu vertreiben und das nächsthöhere Level zu erklimmen. Aber statt mit Zuckerdrops und Bonbons hantiert man in dieser online spielbaren App mit Zucker, Mehl und Zimt – diese sollen zu leckeren Lebkuchen, Makronen und Pfeffernüssen verschoben, äh, gebacken werden. In den sich im Schwierigkeitsgrad steigernden Leveln bäckt man über 100 Jahre alte Originalrezepte von Nürnberger Lebkuchen nach. Und natürlich darf man Spielfreude und Rezepte auch mit seinen Freunden teilen.

# Beschreibung

Bereits im letzten Jahr in der Adventszeit bin ich auf das Rezeptbuch "Die Nürnberger Lebkuchen" aus dem Jahre 1898 bei der Sächsischen Landesbibliothek – Staats- und Universitätsbibliothek Dresden (SLUB) aufmerksam geworden. Dort sind Originalrezepte für Lebkuchen, Makronen und Pfeffernüsse aus Nürnberg niedergeschrieben. Als Coding da Vinci dieses Jahr startete und die SLUB als Kulturinstitution vertreten war, habe ich sofort nachgeschaut und das Rezeptbuch in der unter der CC-BY-SA lizensierten Sammlung "Bibliotheca Gastronomica" wiedergefunden.

Mit digitalisierten Büchern unter freier Lizenz, als PDF-Datei, ohne Metadaten und ohne OCR-Erkennung kann man viele sinnvolle Projekte erdenken. Für mich war ganz klar: Das muss ein Casual Game werden. Eines, wo die Regeln klar, bekannt und einfach sind. So wie bei dem Spiel mit den Zuckerdrops und bunten Bonbons, die zu 3er-, 4er- oder 5er-Kombinationen zusammengeschoben werden müssen.

Im Rezeptbuch gibt es auf über 100 Seiten viele Rezepte typisch deutscher Adventsleckereien. Diese soll man alle in verschiedenen Leveln nachbacken, indem man die einzelnen Zutaten vom Spielfeld sammelt bzw. entfernt. Nach und nach werden die Rezepte schwieriger. Und am Ende hat man – ohne es zu ahnen – das gesamte Rezeptbuch gelesen. Und hat man ein Level abgeschlossen und das Rezept gefällt einem, soll man es mit seinen Freunden per E-Mail, Facebook und Co. teilen können.

Noch ist das Spiel nicht fertig und läuft lediglich im Browser. Ideal wäre es als App, die zur Vorweihnachtszeit in die App-Stores entlassen wird. Denn thematisch würde es ideal zu dieser Zeit passen.

Ich verwende intern die Bibliothek phaser.js. Diese ist speziell auf Browserspiele ausgelegt und nimmt mir viel Arbeit ab, z.B. um auf den verschiedenen Geräteklassen optimal zu laufen. Ein Teil der Arbeit ist das Programmieren, ein anderer die Erstellung der verwendeten Grafiken. Im Internet gibt es viele Vorlagen als Inspiration. Das Winter- oder eher schon Weihnachts-Thema eignet sich hervorragen, wurden aus Deutschland doch viele Weihnachtstraditionen in alle Welt getragen. Beim Level-Design und Übertragen der Rezepte aus dem Buch in das Spiel bekam ich tatkräftige Unterstützung von meinen Kindern.

# Datenauswahl

* [Bibliotheca Gastronomica](http://codingdavinci.de/daten/#slub-dresden) der SLUB Dresden
* [Die Nürnberger Lebkuchen](http://digital.slub-dresden.de/werkansicht/dlf/12327/) als PDF-Rezeptbuch

# Lizenzen

Der Quelltext steht unter einer MIT-Lizenz. Die Leveldaten sind abgeleitet aus dem Werk der SLUB und stehen somit auch unter "SLUB Dresden, [slubdd.de/katalog?TN_libero_mab214078761](http://slubdd.de/katalog?TN_libero_mab214078761) ([CC-BY-SA 4.0](http://creativecommons.org/licenses/by-sa/4.0/deed.de))".

Der benutzte Font [Coaster](http://www.dafont.com/coaster.font) ist "100% Free".

Die Grafiken basieren auf [Winter Platformer Game Tileset](http://opengameart.org/content/winter-platformer-game-tileset) mit einer [CC0-Lizenz](http://creativecommons.org/publicdomain/zero/1.0/). Meine Ableitungen stelle ich unter eine CC-BY 4.0-Lizenz.

# App

Die App wird erstmal nur im Browser laufen. Weitere Schritte kommen später. Eine Testversion befindet sich unter http://tursics.de/sample/gingerbread/
