import { ShopManager } from '../editor/shopData.js';
import { EarnMoneyManager } from '../economy/earnMoneyData.js';

export const HOME_CATALOG = {
  expansions: [
    { id: 'living_room', name: 'Wohnzimmer', icon: '🏠', price: 0, desc: 'Dein gemütliches Basis-Zuhause' },
    { id: 'kitchen', name: 'Küche', icon: '🍳', price: 80, desc: 'Schaltet die Einbauküche frei (+5 🪙 beim Kochen)' },
    { id: 'pet_room', name: 'Tierzimmer', icon: '🐾', price: 95, isNew: true, desc: 'Ein eigener Raum für deine Tiere – dort bleiben sie & du kannst sie abholen!' },
    { id: 'roommate_room', name: 'WG-Zimmer (Mitbewohner)', icon: '🛏️', price: 120, isNew: true, desc: 'Eigenes gemütliches Zimmer für deine/n Mitbewohner/in zum Schlafen, Arbeiten & Entspannen!' },
    { id: 'bedroom', name: 'Obergeschoss', icon: '🪜', price: 130, desc: 'Baut ein zweites Stockwerk auf dein Haus' },
    { id: 'stable', name: 'Reit-Stall', icon: '🐴', price: 160, isNew: true, desc: 'Gemütlicher Pferde- & Reittier-Stall im Garten für alle deine Reittiere!' },
    { id: 'conservatory', name: 'Wintergarten', icon: '🪴', price: 170, desc: 'Gläserner Anbau zwischen Haus und Garten' },
    { id: 'balcony', name: 'Sonniger Balkon', icon: '🌅', price: 195, unlockLevel: 2, isNew: true, desc: 'Schicker Balkon am Obergeschoss' },
    { id: 'pool_deck', name: 'Pool-Terrasse', icon: '🏊', price: 260, unlockLevel: 3, isNew: true, desc: 'Blauer Gartenpool zum Abkühlen!' },
    { id: 'observatory', name: 'Dach-Sternwarte', icon: '🔭', price: 340, unlockLevel: 6, isNew: true, desc: 'Glaskuppel mit Teleskop zum Sternegucken!' }
  ],
  furniture: [
    { id: 'sofa', name: 'Gemütliches Sofa', icon: '🛋️', price: 50, desc: 'Ein weiches rotes Cartoon-Sofa' },
    { id: 'table', name: 'Esstisch', icon: '🪑', price: 45, desc: 'Holztisch für leckere Mahlzeiten' },
    { id: 'beanbag', name: 'Kuschel-Sitzsack', icon: '🟣', price: 70, isNew: true, desc: 'Super bequemer Sitzsack fürs Wohnzimmer' },
    { id: 'tv', name: 'Smart-TV', icon: '📺', price: 90, desc: 'Großer Flachbildschirm an der Wand' },
    { id: 'bed', name: 'Kuschel-Bett', icon: '🛏️', price: 110, desc: 'Perfekt zum Ausruhen nach dem Rennen' },
    { id: 'vanity', name: 'Schmink- & Stylingtisch', icon: '🪞', price: 125, isNew: true, desc: 'Eleganter Spiegel-Tisch mit Lichtern' },
    { id: 'aquarium', name: 'Aquarium', icon: '🐠', price: 140, desc: 'Leuchtendes Becken mit bunten Fischen' },
    { id: 'fireplace', name: 'Gemütlicher Kamin', icon: '🔥', price: 155, isNew: true, desc: 'Knisterndes Kaminfeuer für kühle Abende' },
    { id: 'gaming_setup', name: 'Gaming-Ecke', icon: '🎮', price: 165, isNew: true, desc: 'Leuchtender Monitor & Zocker-Stuhl' },
    { id: 'piano', name: 'Konzert-Klavier', icon: '🎹', price: 185, unlockLevel: 2, isNew: true, desc: 'Spielt fröhliche Melodien im Wohnzimmer' },
    { id: 'dj_booth', name: 'DJ-Musik-Ecke', icon: '🎧', price: 195, unlockLevel: 3, isNew: true, desc: 'Perfekt für deine eigenen Haus-Partys!' },
    { id: 'home_cinema', name: 'Heimkino', icon: '🎬', price: 260, unlockLevel: 5, isNew: true, desc: 'Große Kino-Leinwand für Filmabende mit Freunden' },
    { id: 'arcade', name: 'Retro-Spielautomat', icon: '🕹️', price: 210, rotatingBatch: 0, isNew: true, desc: 'Neue Lieferung: Eigener Spielautomat fürs Wohnzimmer!' },
    { id: 'massage_chair', name: 'Traum-Massagesessel', icon: '💺', price: 225, rotatingBatch: 1, isNew: true, desc: 'Neue Lieferung: Luxus-Sessel zum Entspannen!' },
    { id: 'jukebox', name: 'Neon-Jukebox', icon: '🎵', price: 190, rotatingBatch: 2, isNew: true, desc: 'Neue Lieferung: Spielt deine Lieblingshits im Haus!' }
  ],
  decor: [
    { id: 'rug', name: 'Fluffiger Teppich', icon: '🧶', price: 35, desc: 'Warmer Teppich fürs Wohnzimmer' },
    { id: 'plant', name: 'Zimmerpflanze', icon: '🪴', price: 40, desc: 'Frisches Grün für drinnen' },
    { id: 'painting', name: 'Bilderrahmen', icon: '🖼️', price: 55, desc: 'Schönes Gemälde an der Wand' },
    { id: 'wall_clock', name: 'Traum-Wanduhr', icon: '🕰️', price: 65, isNew: true, desc: 'Goldene Wanduhr für Flur & Wohnzimmer' },
    { id: 'lights', name: 'Lichterkette', icon: '✨', price: 75, desc: 'Gemütliche goldene Lichter' },
    { id: 'lava_lamp', name: 'Lavalampe', icon: '🪩', price: 85, isNew: true, desc: 'Bunte blubbernde Leucht-Deko' },
    { id: 'plush_shelf', name: 'Kuscheltier-Regal', icon: '🧸', price: 90, isNew: true, desc: 'Süße Plüschtiere ordentlich aufgestellt' },
    { id: 'bookshelf', name: 'Bücherregal', icon: '📚', price: 95, desc: 'Voll mit spannenden Abenteuern' },
    { id: 'trophy_shelf', name: 'Pokal-Regal', icon: '🏆', price: 120, unlockLevel: 2, isNew: true, desc: 'Zeigt deine goldenen Lauf-Pokale' },
    { id: 'chandelier', name: 'Kristall-Leuchter', icon: '💎', price: 165, unlockLevel: 4, isNew: true, desc: 'Funkelnder Kronleuchter für dein Wohnzimmer' },
    { id: 'paper_lantern', name: 'Lampion-Girlande', icon: '🏮', price: 70, rotatingBatch: 0, isNew: true, desc: 'Neue Lieferung: Bunte Leucht-Lampions!' },
    { id: 'gold_mirror', name: 'Sonnen-Wandspiegel', icon: '☀️', price: 105, rotatingBatch: 1, isNew: true, desc: 'Neue Lieferung: Funkelnder Spiegel mit Goldrahmen!' },
    { id: 'cactus_trio', name: 'Kaktus-Sammlung', icon: '🌵', price: 60, rotatingBatch: 2, isNew: true, desc: 'Neue Lieferung: Pflegeleichte Mini-Kakteen!' }
  ],
  garden: [
    { id: 'mailbox', name: 'Briefkasten', icon: '📬', price: 45, isNew: true, desc: 'Bekomme jeden Tag 1–2 Briefe & Einladungen von Freunden!' },
    { id: 'flowerbed', name: 'Blumenbeet', icon: '🌷', price: 0, desc: 'Bunte Blumen im Vorgarten' },
    { id: 'veggies', name: 'Gemüsebeet', icon: '🥕', price: 60, desc: 'Leckeres Gemüse (+10 🪙 pro Ernte)' },
    { id: 'sandbox', name: 'Sandkasten', icon: '🏖️', price: 95, isNew: true, desc: 'Gemütliche Sand-Ecke zum Buddeln im Garten' },
    { id: 'apple_tree', name: 'Apfelbaum', icon: '🍎', price: 95, desc: 'Trägt saftige Äpfel (+12 🪙 pro Ernte)' },
    { id: 'flower_arch', name: 'Rosenbogen', icon: '🌸', price: 115, isNew: true, desc: 'Duftender Blütenbogen für den Gartenweg' },
    { id: 'pond', name: 'Gartenteich', icon: '🪷', price: 125, desc: 'Kleiner Teich mit Seerosen' },
    { id: 'swing', name: 'Gartenschaukel', icon: '🎠', price: 145, isNew: true, desc: 'Schaukelspaß im grünen Garten' },
    { id: 'bbq', name: 'Grill-Ecke', icon: '🍔', price: 160, unlockLevel: 2, isNew: true, desc: 'Leckeres BBQ-Fest im Garten (+6 🪙 beim Kochen)' },
    { id: 'treehouse', name: 'Baumhaus', icon: '🏡', price: 180, desc: 'Ein echtes Abenteuer-Baumhaus!' },
    { id: 'gold_mailbox', name: 'Gold-Briefkasten', icon: '✨', price: 135, unlockLevel: 3, isNew: true, desc: 'Schicker Gold-Briefkasten mit Extra-Münzen in Geschenkbriefen!' },
    { id: 'greenhouse', name: 'Gewächshaus', icon: '🌿', price: 220, unlockLevel: 3, isNew: true, desc: 'Lässt Pflanzen turbo-schnell wachsen (+15 🪙 Ernte)' },
    { id: 'jacuzzi', name: 'Garten-Whirlpool', icon: '🛁', price: 245, unlockLevel: 3, isNew: true, desc: 'Sprudelnder Outdoor-Whirlpool im Garten' },
    { id: 'fountain', name: 'Garten-Brunnen', icon: '⛲', price: 190, unlockLevel: 4, isNew: true, desc: 'Plätschernder Wunschbrunnen direkt vor der Terrasse' },
    { id: 'hammock', name: 'Hängematte', icon: '🌴', price: 185, unlockLevel: 5, isNew: true, desc: 'Gemütliche Sonnen-Hängematte im Garten' },
    { id: 'rainbow_slide', name: 'Regenbogen-Rutsche', icon: '🌈', price: 290, unlockLevel: 6, isNew: true, desc: 'Bunte Garten-Rutsche für Partys mit Nachbarn!' },
    { id: 'berry_bush', name: 'Beeren-Hecke', icon: '🫐', price: 85, rotatingBatch: 0, isNew: true, desc: 'Neue Lieferung: Frische Heidelbeeren direkt im Garten!' },
    { id: 'birdhouse', name: 'Vogelhäuschen', icon: '🐦', price: 65, rotatingBatch: 1, isNew: true, desc: 'Neue Lieferung: Süßes Häuschen für Singvögel!' },
    { id: 'sunflower_row', name: 'Sonnenblumen-Beet', icon: '🌻', price: 75, rotatingBatch: 2, isNew: true, desc: 'Neue Lieferung: Riesige strahlende Sonnenblumen!' }
  ],
  pets: [
    { id: 'turtle', name: 'Schildkröte Speedy', icon: '🐢', price: 65, desc: 'Gemütlich, lieb und mag Salat' },
    { id: 'bunny', name: 'Hase Hoppel', icon: '🐰', price: 70, desc: 'Hüpft fröhlich durch den Garten' },
    { id: 'hamster', name: 'Hamster Krümel', icon: '🐹', price: 75, isNew: true, desc: 'Klein, flauschig und super niedlich' },
    { id: 'cat', name: 'Katze Luna', icon: '🐱', price: 85, desc: 'Schnurrt leise auf dem Sofa' },
    { id: 'dog', name: 'Hund Bello', icon: '🐶', price: 90, desc: 'Dein treuer bester Freund' },
    { id: 'parrot', name: 'Papagei Coco', icon: '🦜', price: 115, desc: 'Bunt, klug und plappert gern' },
    { id: 'fox', name: 'Fuchs Foxy', icon: '🦊', price: 175, unlockLevel: 2, isNew: true, desc: 'Schlauer kleiner Garten-Fuchs' },
    { id: 'unicorn', name: 'Mini-Einhorn', icon: '🦄', price: 280, unlockLevel: 3, isNew: true, desc: 'Magisches Glitzer-Einhorn!' },
    { id: 'panda', name: 'Panda Mochi', icon: '🐼', price: 230, unlockLevel: 4, isNew: true, desc: 'Knuddeliger Panda, der frischen Bambus knabbert' },
    { id: 'dragon', name: 'Glücks-Drache Fips', icon: '🐉', price: 310, unlockLevel: 5, isNew: true, desc: 'Süßer Mini-Drache mit Glitzerflügeln' },
    { id: 'phoenix', name: 'Sternen-Vogel', icon: '🐦‍🔥', price: 360, unlockLevel: 6, isNew: true, desc: 'Magischer Traumvogel, der extra Münzen bringt' }
  ],
  mounts: [
    { id: 'pony', name: 'Reit-Pony Sternchen', icon: '🐴', price: 220, isNew: true, desc: 'Braves Pony zum Draufreiten in Stadt & Garten! Passt perfekt in den Stall.' },
    { id: 'alpaca', name: 'Flausch-Alpaka Flocke', icon: '🦙', price: 310, isNew: true, desc: 'Flauschiges Reit-Alpaka mit buntem Sattel!' },
    { id: 'horse', name: 'Reitpferd Blitz', icon: '🐎', price: 460, isNew: true, desc: 'Schnelles, elegantes Reitpferd für lange Ritte durch Traumstadt!' },
    { id: 'deer', name: 'Wald-Hirsch Goldhorn', icon: '🦌', price: 590, unlockLevel: 2, isNew: true, desc: 'Majestätischer Hirsch, auf dem du stolz reiten kannst!' },
    { id: 'mount_unicorn', name: 'Reit-Einhorn Saphira', icon: '🦄', price: 880, unlockLevel: 3, isNew: true, desc: 'Echtes großes Glitzer-Einhorn zum Draufreiten!' },
    { id: 'donkey', name: 'Reit-Esel Anton', icon: '🫏', price: 260, rotatingBatch: 0, isNew: true, desc: 'Neue Lieferung: Treuer grauer Reit-Esel für deinen Stall!' },
    { id: 'camel', name: 'Wüsten-Kamel Samir', icon: '🐪', price: 520, rotatingBatch: 1, isNew: true, desc: 'Neue Lieferung: Gemütliches Reit-Kamel!' },
    { id: 'pegasus', name: 'Flügel-Pegasus Aura', icon: '🪽', price: 960, rotatingBatch: 2, isNew: true, desc: 'Neue Lieferung: Schnelles Geflügel-Pferd für den Stall!' }
  ],
  vehicles: [
    { id: 'skateboard', name: 'Profi-Skateboard', icon: '🛹', price: 180, isNew: true, desc: 'Wendig & schnell auf Wegen und Promenaden – spare ein paar Läufe lang!' },
    { id: 'scooter', name: 'City-Stunt-Roller', icon: '🛴', price: 290, isNew: true, desc: 'Flinker Tretroller mit Lenker für deinen Stadtbummel!' },
    { id: 'bike', name: 'City-Fahrrad', icon: '🚲', price: 480, isNew: true, desc: 'Gemütliches Fahrrad für Stadt & Garten – echtes Sparziel!' },
    { id: 'escooter', name: 'Elektro-Roller', icon: '⚡', price: 720, isNew: true, desc: 'Moderner E-Scooter mit Akku-Antrieb – ganz schön flott!' },
    { id: 'moped', name: 'Stadt-Moped', icon: '🛵', price: 1250, isNew: true, desc: 'Schickes Retro-Moped! Darf auf Wegen & der Stadtstraße fahren!' },
    { id: 'motorcycle', name: 'Sport-Motorrad', icon: '🏍️', price: 2100, isNew: true, desc: 'Richtig schnelles Motorrad – hierfür musst du fleißig sparen!' },
    { id: 'compact_car', name: 'City-Kleinwagen', icon: '🚗', price: 3200, isNew: true, desc: 'Dein erstes eigenes Auto! Teuer wie im echten Leben – viel Spaß beim Sparen!' },
    { id: 'suv', name: 'Abenteuer-SUV', icon: '🚙', price: 4600, isNew: true, desc: 'Großer Familien-SUV mit Platz & Power für jede Straße!' },
    { id: 'sportscar', name: 'Traum-Sportwagen', icon: '🏎️', price: 6800, isNew: true, desc: 'Luxus-Rennwagen für echte Spar-Profis!' },
    { id: 'skates', name: 'Retro-Rollschuhe', icon: '🛼', price: 210, rotatingBatch: 0, isNew: true, desc: 'Neue Lieferung: Glitzernde Retro-Rollschuhe!' },
    { id: 'roadbike', name: 'Turbo-Rennrad', icon: '🚴', price: 620, rotatingBatch: 1, isNew: true, desc: 'Neue Lieferung: Leichtes Sport-Rennrad!' },
    { id: 'quad', name: 'Abenteuer-Quad', icon: '🛺', price: 1650, rotatingBatch: 2, isNew: true, desc: 'Neue Lieferung: Starkes Geländefahrzeug!' },
    { id: 'convertible', name: 'Sommer-Cabrio', icon: '🚘', price: 3900, rotatingBatch: 0, isNew: true, desc: 'Neue Lieferung: Offenes Traum-Cabrio!' },
    { id: 'camper', name: 'Traum-Camper', icon: '🚐', price: 5400, rotatingBatch: 1, isNew: true, desc: 'Neue Lieferung: Gemütliches Reise-Wohnmobil!' }
  ],
  petItems: [
    { id: 'bowl', name: 'Gold-Napf', icon: '🥣', price: 35, desc: 'Schicker Napf fürs Tierzimmer' },
    { id: 'pet_cushion', name: 'Kuschelkissen', icon: '🛋️', price: 40, isNew: true, desc: 'Weiches Sternen-Kissen fürs Tierzimmer' },
    { id: 'ball', name: 'Spielball', icon: '⚽', price: 45, desc: 'Damit spielen deine Tiere gern' },
    { id: 'pet_tunnel', name: 'Spiel-Tunnel', icon: '🌈', price: 55, isNew: true, desc: 'Bunter Flitzer-Tunnel fürs Tierzimmer' },
    { id: 'hay_rack', name: 'Heu-Raufe & Karottenkorb', icon: '🌾', price: 60, isNew: true, desc: 'Frisches Heu & Möhren für deinen Reit-Stall!' },
    { id: 'hamster_wheel', name: 'Laufrad', icon: '🎡', price: 65, isNew: true, desc: 'Flitzer-Rad für kleine Tiere' },
    { id: 'pet_bed', name: 'Tierkörbchen', icon: '🧺', price: 70, desc: 'Extra weicher Schlafplatz fürs Tierzimmer' },
    { id: 'water_fountain', name: 'Trink-Brunnen', icon: '⛲', price: 75, isNew: true, desc: 'Frisches Sprudelwasser fürs Tierzimmer (+4 🪙 beim Füttern)' },
    { id: 'cat_tree', name: 'Kletterbaum', icon: '🪵', price: 85, desc: 'Abenteuer-Kletterturm fürs Tierzimmer' },
    { id: 'saddle_stand', name: 'Sattel-Ständer & Striegel', icon: '🐎', price: 95, isNew: true, desc: 'Schicker Pferde-Pflegeplatz für deinen Reit-Stall!' },
    { id: 'pet_bath', name: 'Schaum-Wanne', icon: '🛁', price: 80, unlockLevel: 2, isNew: true, desc: 'Blubber-Badewanne für glückliche Tiere' },
    { id: 'pet_house', name: 'Hundehütte', icon: '🛖', price: 120, unlockLevel: 2, isNew: true, desc: 'Gemütliche Hütte für Garten & Tierzimmer' },
    { id: 'yarn_play', name: 'Woll-Spielzeug', icon: '🧶', price: 32, rotatingBatch: 0, isNew: true, desc: 'Neue Lieferung: Buntes Spielzeug für Katzen & Welpen!' },
    { id: 'bone_plush', name: 'Riesen-Plüschknochen', icon: '🦴', price: 48, rotatingBatch: 1, isNew: true, desc: 'Neue Lieferung: Weicher Kuschelknochen!' },
    { id: 'grooming_kit', name: 'Glanz-Pflegeset', icon: '✨', price: 65, rotatingBatch: 2, isNew: true, desc: 'Neue Lieferung: Bürste & Shampoo für Tierzimmer & Stall!' }
  ],
  supplies: [
    { id: 'buy_food', name: 'Koch-Zutaten (+3)', icon: '🥘', price: 15, isConsumable: true, key: 'food', amount: 3, desc: 'Frische Zutaten für deinen Kühlschrank (3x Kochen)' },
    { id: 'buy_pizza', name: 'Ofenfrische Pizza-Box (+3)', icon: '🍕', price: 18, isConsumable: true, key: 'food', amount: 3, isNew: true, desc: 'Leckere Pizza-Vorräte direkt in den Kühlschrank' },
    { id: 'buy_snacks', name: 'Obst & Snacks (+3)', icon: '🍓', price: 14, isConsumable: true, key: 'fridgeSnacks', amount: 3, desc: 'Leckere Snacks direkt für deinen Kühlschrank' },
    { id: 'buy_bakery', name: 'Bäcker-Croissant-Box (+4)', icon: '🥐', price: 19, isConsumable: true, key: 'fridgeSnacks', amount: 4, isNew: true, desc: 'Knusprige Croissants & Brötchen für den Kühlschrank' },
    { id: 'buy_drinks', name: 'Kakao, Saft & Wasser (+4)', icon: '🥤', price: 14, isConsumable: true, key: 'drinks', amount: 4, desc: 'Erfrischende Getränke für dich & deine/n Mitbewohner/in' },
    { id: 'buy_smoothie', name: 'Beeren-Smoothies (+4)', icon: '🫐', price: 16, isConsumable: true, key: 'drinks', amount: 4, isNew: true, desc: 'Fruchtige Smoothies gegen Durst & Müdigkeit' },
    { id: 'buy_cheese_box', name: 'Käse & Pasta-Box (+4)', icon: '🧀', price: 18, isConsumable: true, key: 'food', amount: 4, desc: 'Große Vorratsbox für den Kühlschrank (4x Kochen)' },
    { id: 'buy_pet_food', name: 'Tierfutter (+3)', icon: '🦴', price: 15, isConsumable: true, key: 'petFood', amount: 3, desc: 'Leckeres Futter für 3x Füttern' },
    { id: 'buy_horse_treats', name: 'Möhren & Hafer-Mix (+4)', icon: '🥕', price: 18, isConsumable: true, key: 'petFood', amount: 4, isNew: true, desc: 'Knackige Möhren für Reittiere, Stall & Haustiere!' },
    { id: 'buy_medicine', name: 'Kräutertee & Medizin (+3)', icon: '🍵', price: 16, isConsumable: true, key: 'medicine', amount: 3, desc: 'Hilft dir & deinem WG-Mitbewohner schnell wieder gesund zu werden' },
    { id: 'buy_vitamins', name: 'Vitamin-Saft (+3)', icon: '🍋', price: 17, isConsumable: true, key: 'medicine', amount: 3, isNew: true, desc: 'Stärkt Abwehrkräfte & macht schnell wieder gesund' },
    { id: 'buy_pet_medicine', name: 'Tier-Medizin (+3)', icon: '💊', price: 16, isConsumable: true, key: 'petMedicine', amount: 3, desc: 'Pflegt ein kränkelndes Tier schnell wieder fit und munter' },
    { id: 'buy_sushi', name: 'Sushi-Spezial-Box (+4)', icon: '🍱', price: 20, rotatingBatch: 0, isConsumable: true, key: 'food', amount: 4, isNew: true, desc: 'Neue Lieferung: Frische Sushi-Box für deinen Kühlschrank!' },
    { id: 'buy_cupcakes', name: 'Glitzer-Cupcakes (+4)', icon: '🧁', price: 17, rotatingBatch: 1, isConsumable: true, key: 'fridgeSnacks', amount: 4, isNew: true, desc: 'Neue Lieferung: Süße Cupcakes aus der Konditorei!' },
    { id: 'buy_bubbletea', name: 'Bubble-Tea Mix (+4)', icon: '🧋', price: 17, rotatingBatch: 2, isConsumable: true, key: 'drinks', amount: 4, isNew: true, desc: 'Neue Lieferung: Trendiger Bubble-Tea für dich & WG!' },
    { id: 'vacuum', name: 'Turbo-Staubsauger', icon: '🧹', price: 75, desc: 'Putzt blitzschnell & gibt +5 🪙 Extra beim Putzen' },
    { id: 'gold_can', name: 'Gold-Gießkanne', icon: '🚿', price: 80, desc: 'Verdoppelt das Wachstum beim Gießen!' },
    { id: 'robot_helper', name: 'Haus-Roboter', icon: '🤖', price: 240, unlockLevel: 2, isNew: true, desc: 'Hält dein Haus länger sauber & schenkt extra Münzen!' }
  ]
};

const HOME_KEY = 'runner_home_state';
const PETSIT_SLOTS_KEY = 'runner_petsit_slots';
const STORE_ROTATION_KEY = 'runner_store_rotation';
export const HOME_MYSTERY_BOX_PRICE = 75;

function getDateSeed() {
  const d = new Date();
  return d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
}

export const StoreRotationManager = {
  getState() {
    try {
      const raw = localStorage.getItem(STORE_ROTATION_KEY);
      if (!raw) {
        const init = { batch: 0, lastRotatedAt: Date.now() };
        localStorage.setItem(STORE_ROTATION_KEY, JSON.stringify(init));
        return init;
      }
      const parsed = JSON.parse(raw);
      return {
        batch: Number.isFinite(parsed.batch) ? parsed.batch : 0,
        lastRotatedAt: Number.isFinite(parsed.lastRotatedAt) ? parsed.lastRotatedAt : Date.now()
      };
    } catch {
      return { batch: 0, lastRotatedAt: Date.now() };
    }
  },

  getCurrentBatch() {
    this.checkAutoRotate();
    return this.getState().batch % 3;
  },

  checkAutoRotate(maxAgeMs = 240000) {
    const st = this.getState();
    if (Date.now() - st.lastRotatedAt >= maxAgeMs) {
      const next = { batch: (st.batch + 1) % 3, lastRotatedAt: Date.now() };
      try {
        localStorage.setItem(STORE_ROTATION_KEY, JSON.stringify(next));
      } catch {
        // Ignore storage error
      }
      return next.batch;
    }
    return st.batch % 3;
  },

  advanceBatch() {
    const st = this.getState();
    const next = { batch: (st.batch + 1) % 3, lastRotatedAt: Date.now() };
    try {
      localStorage.setItem(STORE_ROTATION_KEY, JSON.stringify(next));
    } catch {
      // Ignore storage error
    }
    window.dispatchEvent(new CustomEvent('runner:store-rotated', { detail: next }));
    return next.batch;
  },

  isVisibleInShelf(category, item) {
    if (!item) return false;
    if (item.rotatingBatch === undefined) return true;
    if (!item.isConsumable && HomeManager.hasItem(category, item.id)) return true;
    return (item.rotatingBatch % 3) === this.getCurrentBatch();
  }
};

function getDefaultHomeState() {
  return {
    owned: {
      expansions: ['living_room'],
      furniture: [],
      decor: [],
      garden: ['flowerbed'],
      pets: [],
      mounts: [],
      vehicles: [],
      petItems: [],
      supplies: []
    },
    inventory: {
      food: 3,
      petFood: 3,
      fridgeSnacks: 2,
      drinks: 3,
      medicine: 2,
      petMedicine: 2
    },
    needs: {
      cleanliness: 75,
      hunger: 70,
      thirst: 80,
      petCare: 80,
      gardenGrowth: 40,
      energy: 88,
      petEnergy: 88
    },
    health: {
      playerSick: null,
      sickPets: {},
      lastSickTime: 0,
      ticksSinceSickCheck: 0
    },
    activeTransport: null,
    companionPets: [],
    sittingCompanions: [],
    lastDailyBonusDate: '',
    lastUpdate: Date.now()
  };
}

export const HomeManager = {
  getState() {
    try {
      const raw = localStorage.getItem(HOME_KEY);
      if (!raw) {
        const def = getDefaultHomeState();
        this.saveState(def);
        return def;
      }
      const parsed = JSON.parse(raw);
      const def = getDefaultHomeState();
      return {
        owned: { ...def.owned, ...(parsed.owned || {}) },
        inventory: { ...def.inventory, ...(parsed.inventory || {}) },
        needs: { ...def.needs, ...(parsed.needs || {}) },
        health: {
          ...def.health,
          ...(parsed.health || {}),
          sickPets: { ...(parsed.health?.sickPets || {}) }
        },
        activeTransport: parsed.activeTransport && parsed.activeTransport.id ? parsed.activeTransport : null,
        companionPets: Array.isArray(parsed.companionPets) ? parsed.companionPets : [],
        sittingCompanions: Array.isArray(parsed.sittingCompanions) ? parsed.sittingCompanions : [],
        lastDailyBonusDate: parsed.lastDailyBonusDate || '',
        lastUpdate: parsed.lastUpdate || Date.now()
      };
    } catch {
      return getDefaultHomeState();
    }
  },

  saveState(state) {
    try {
      state.lastUpdate = Date.now();
      localStorage.setItem(HOME_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage errors
    }
  },

  hasMailbox() {
    return this.hasItem('garden', 'mailbox') || this.hasItem('garden', 'gold_mailbox');
  },

  hasPetRoom() {
    return this.hasItem('expansions', 'pet_room');
  },

  hasStable() {
    return this.hasItem('expansions', 'stable');
  },

  hasRoommateRoom() {
    return this.hasItem('expansions', 'roommate_room');
  },

  hasItem(category, id) {
    const state = this.getState();
    return Array.isArray(state.owned[category]) && state.owned[category].includes(id);
  },

  getOwnedMounts() {
    const list = this.getState().owned.mounts || [];
    return HOME_CATALOG.mounts.filter((m) => list.includes(m.id));
  },

  getOwnedVehicles() {
    const list = this.getState().owned.vehicles || [];
    return HOME_CATALOG.vehicles.filter((v) => list.includes(v.id));
  },

  getActiveTransport() {
    const state = this.getState();
    const tr = state.activeTransport;
    if (!tr || !tr.id) return null;
    if (tr.kind === 'mount' && this.hasItem('mounts', tr.id)) return tr;
    if (tr.kind === 'vehicle' && this.hasItem('vehicles', tr.id)) return tr;
    return null;
  },

  setActiveTransport(kind, id) {
    const state = this.getState();
    if (!kind || !id) {
      state.activeTransport = null;
      this.saveState(state);
      window.dispatchEvent(new CustomEvent('runner:transport-updated', { detail: null }));
      return null;
    }
    const cat = kind === 'mount' ? 'mounts' : 'vehicles';
    if (!this.hasItem(cat, id)) return state.activeTransport;
    state.activeTransport = { kind, id };
    this.saveState(state);
    window.dispatchEvent(new CustomEvent('runner:transport-updated', { detail: state.activeTransport }));
    return state.activeTransport;
  },

  getCompanionPets() {
    const state = this.getState();
    const ownedPets = Array.isArray(state.owned.pets) ? state.owned.pets : [];
    const selected = Array.isArray(state.companionPets) ? state.companionPets : [];
    return selected.filter((id) => ownedPets.includes(id));
  },

  getStayingPets() {
    const state = this.getState();
    const ownedPets = Array.isArray(state.owned.pets) ? state.owned.pets : [];
    const companions = this.getCompanionPets();
    return ownedPets.filter((id) => !companions.includes(id));
  },

  isCompanionPet(petId) {
    return this.getCompanionPets().includes(petId);
  },

  toggleCompanionPet(petId) {
    if (!this.hasItem('pets', petId)) {
      return { ok: false, reason: 'not_owned' };
    }
    const state = this.getState();
    const list = Array.isArray(state.companionPets) ? [...state.companionPets] : [];
    const idx = list.indexOf(petId);
    let active = false;
    if (idx >= 0) {
      list.splice(idx, 1);
      active = false;
    } else {
      list.push(petId);
      active = true;
    }
    state.companionPets = list;
    this.saveState(state);
    window.dispatchEvent(new CustomEvent('runner:pets-updated', { detail: { companionPets: list } }));
    const item = HOME_CATALOG.pets.find((p) => p.id === petId);
    return { ok: true, active, petId, item, companionPets: list };
  },

  setAllCompanions(enabled) {
    const state = this.getState();
    const ownedPets = Array.isArray(state.owned.pets) ? [...state.owned.pets] : [];
    state.companionPets = enabled ? ownedPets : [];
    this.saveState(state);
    window.dispatchEvent(new CustomEvent('runner:pets-updated', { detail: { companionPets: state.companionPets } }));
    return state.companionPets;
  },

  getSittingCompanions() {
    const state = this.getState();
    return Array.isArray(state.sittingCompanions) ? state.sittingCompanions : [];
  },

  getSittingCompanionById(sitId) {
    return this.getSittingCompanions().find((s) => s.id === sitId) || null;
  },

  setSittingCompanions(list) {
    const state = this.getState();
    state.sittingCompanions = Array.isArray(list) ? list : [];
    this.saveState(state);
    window.dispatchEvent(new CustomEvent('runner:pets-updated', { detail: { sittingCompanions: state.sittingCompanions } }));
    return state.sittingCompanions;
  },

  getPetSittingSlots() {
    try {
      const raw = localStorage.getItem(PETSIT_SLOTS_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) && parsed.length === 3 ? parsed : null;
    } catch {
      return null;
    }
  },

  savePetSittingSlots(slots) {
    try {
      const clean = (Array.isArray(slots) ? slots : [null, null, null]).slice(0, 3);
      localStorage.setItem(PETSIT_SLOTS_KEY, JSON.stringify(clean));
      const activeLeashed = clean
        .filter((v) => v && v.state === 'caring' && v.onLeash && v.info)
        .map((v) => ({
          id: `sit_${v.houseIdx}`,
          houseIdx: v.houseIdx,
          species: v.info.species || 'dog',
          name: v.info.name || 'Bello',
          badge: v.info.badge || '🐕 Hund',
          body: v.info.body || '#d97706',
          ear: v.info.ear || '#92400e',
          accent: v.info.accent || '#fde68a',
          collar: v.info.collar || '#ec4899',
          say: `${v.info.species === 'cat' ? 'Miau' : v.info.species === 'bunny' ? 'Hoppel' : 'Wuff'}! Gassi! ❤️`,
          isSitting: true
        }));
      this.setSittingCompanions(activeLeashed);
    } catch {
      // Ignore storage errors
    }
  },

  cuddleCompanionPet(petId) {
    const state = this.getState();
    const sittingObj = typeof petId === 'string' && petId.startsWith('sit_')
      ? this.getSittingCompanionById(petId)
      : null;

    if (sittingObj) {
      state.needs.petCare = Math.min(100, (state.needs.petCare || 70) + 6);
      this.saveState(state);
      const slots = this.getPetSittingSlots();
      if (slots && slots[sittingObj.houseIdx] && slots[sittingObj.houseIdx].state === 'caring') {
        slots[sittingObj.houseIdx].leashDistance = Math.min(240, (slots[sittingObj.houseIdx].leashDistance || 0) + 18);
        if (slots[sittingObj.houseIdx].leashDistance >= 220) {
          slots[sittingObj.houseIdx].walkReady = true;
        }
        try {
          localStorage.setItem(PETSIT_SLOTS_KEY, JSON.stringify(slots));
        } catch {
          // Ignore storage error
        }
      }
      ShopManager.recordProgress(0, 1);
      EarnMoneyManager.recordEvent({ care: 1 });
      return { ok: true, isSitting: true, item: sittingObj, state };
    }

    if (!this.hasItem('pets', petId)) return { ok: false };
    state.needs.petCare = Math.min(100, (state.needs.petCare || 70) + 8);
    this.saveState(state);
    ShopManager.recordProgress(0, 1);
    EarnMoneyManager.recordEvent({ care: 1 });
    window.dispatchEvent(new CustomEvent('runner:pets-updated', { detail: { companionPets: state.companionPets } }));
    const item = HOME_CATALOG.pets.find((p) => p.id === petId);
    return { ok: true, item, state };
  },

  isLevelUnlocked(item) {
    if (!item.unlockLevel) return true;
    const playerLevel = ShopManager.getStats().level || 1;
    return playerLevel >= item.unlockLevel;
  },

  getItemsForLevel(targetLevel) {
    const items = [];
    Object.keys(HOME_CATALOG).forEach((cat) => {
      HOME_CATALOG[cat].forEach((item) => {
        if (item.unlockLevel === targetLevel) {
          items.push({ category: cat, ...item });
        }
      });
    });
    return items;
  },

  // Daily rotating 30% deals in Home Shop
  getDailyDeals() {
    const seed = getDateSeed();
    const pool = [];
    Object.keys(HOME_CATALOG).forEach((cat) => {
      HOME_CATALOG[cat].forEach((item) => {
        if (item.price > 0 && !item.isConsumable && this.isLevelUnlocked(item)) {
          pool.push({ category: cat, id: item.id });
        }
      });
    });
    if (pool.length === 0) return [];
    const idx1 = (seed * 3 + 5) % pool.length;
    const idx2 = (seed * 11 + 2) % pool.length;
    const deals = [pool[idx1]];
    if (idx2 !== idx1) deals.push(pool[idx2]);
    return deals;
  },

  isDailyDeal(category, itemId) {
    return this.getDailyDeals().some((d) => d.category === category && d.id === itemId);
  },

  getEffectivePrice(category, item) {
    if (!item || item.price <= 0) return 0;
    if (!item.isConsumable && this.isDailyDeal(category, item.id)) {
      return Math.max(10, Math.round((item.price * 0.7) / 5) * 5);
    }
    return item.price;
  },

  claimDailyVisitBonus() {
    const today = new Date().toDateString();
    const state = this.getState();
    if (state.lastDailyBonusDate !== today) {
      state.lastDailyBonusDate = today;
      this.saveState(state);
      ShopManager.addCoins(15);
      return 15;
    }
    return 0;
  },

  addSupply(key, amount = 1) {
    const state = this.getState();
    state.inventory[key] = (state.inventory[key] || 0) + amount;
    this.saveState(state);
    return state.inventory[key];
  },

  getRunPocketMoneyBonus() {
    const state = this.getState();
    let bonus = (state.owned.pets?.length || 0) * 2;
    if (this.hasItem('decor', 'trophy_shelf')) bonus += 5;
    if (this.hasItem('supplies', 'robot_helper')) bonus += 5;
    if (this.hasItem('garden', 'greenhouse')) bonus += 4;
    if (this.hasItem('pets', 'phoenix')) bonus += 8;
    return bonus;
  },

  buyItem(category, itemId) {
    const list = HOME_CATALOG[category] || [];
    const item = list.find((i) => i.id === itemId);
    if (!item) return { ok: false, reason: 'not_found' };

    if (!this.isLevelUnlocked(item)) {
      return { ok: false, reason: 'level_locked', requiredLevel: item.unlockLevel, item };
    }

    const state = this.getState();
    const price = this.getEffectivePrice(category, item);

    if (item.isConsumable) {
      const coins = ShopManager.getCoins();
      if (coins < price) {
        return { ok: false, reason: 'insufficient_funds', missing: price - coins, item, price };
      }
      ShopManager.setCoins(coins - price);
      state.inventory[item.key] = (state.inventory[item.key] || 0) + item.amount;
      this.saveState(state);
      return { ok: true, item, price, consumable: true, remainingCoins: ShopManager.getCoins() };
    }

    if (this.hasItem(category, itemId)) {
      return { ok: true, alreadyOwned: true, item };
    }

    const coins = ShopManager.getCoins();
    if (coins < price) {
      return { ok: false, reason: 'insufficient_funds', missing: price - coins, item, price };
    }

    ShopManager.setCoins(coins - price);
    if (!Array.isArray(state.owned[category])) state.owned[category] = [];
    state.owned[category].push(itemId);

    if (category === 'pets' && state.owned.pets.length === 1) {
      state.needs.petCare = 80;
    }

    if (category === 'mounts') {
      state.activeTransport = { kind: 'mount', id: itemId };
    } else if (category === 'vehicles') {
      state.activeTransport = { kind: 'vehicle', id: itemId };
    }

    this.saveState(state);
    if (category === 'mounts' || category === 'vehicles') {
      window.dispatchEvent(new CustomEvent('runner:transport-updated', { detail: state.activeTransport }));
    }
    return { ok: true, item, price, remainingCoins: ShopManager.getCoins() };
  },

  buyHomeMysteryBox() {
    const lockedPool = [];
    Object.keys(HOME_CATALOG).forEach((cat) => {
      HOME_CATALOG[cat].forEach((item) => {
        if (!item.isConsumable && !this.hasItem(cat, item.id) && this.isLevelUnlocked(item)) {
          lockedPool.push({ category: cat, item });
        }
      });
    });

    if (lockedPool.length === 0) {
      return { ok: false, reason: 'all_unlocked' };
    }

    const coins = ShopManager.getCoins();
    if (coins < HOME_MYSTERY_BOX_PRICE) {
      return { ok: false, reason: 'insufficient_funds', missing: HOME_MYSTERY_BOX_PRICE - coins };
    }

    ShopManager.setCoins(coins - HOME_MYSTERY_BOX_PRICE);
    const pick = lockedPool[Math.floor(Math.random() * lockedPool.length)];
    const state = this.getState();
    if (!Array.isArray(state.owned[pick.category])) state.owned[pick.category] = [];
    state.owned[pick.category].push(pick.item.id);

    if (pick.category === 'pets' && state.owned.pets.length === 1) {
      state.needs.petCare = 80;
    }

    this.saveState(state);
    return { ok: true, category: pick.category, item: pick.item, remainingCoins: ShopManager.getCoins() };
  },

  _maybeTriggerRareSickness(state, source = 'tick') {
    if (!state.health) {
      state.health = { playerSick: null, sickPets: {}, lastSickTime: 0, ticksSinceSickCheck: 0 };
    }
    const now = Date.now();
    const cooldownMs = 180000; // Mindestens 3 Minuten Pause zwischen seltenen Krankheiten
    if (now - (state.health.lastSickTime || 0) < cooldownMs) return null;

    const alreadyPlayerSick = Boolean(state.health.playerSick);
    const ownedPets = Array.isArray(state.owned?.pets) ? state.owned.pets : [];
    const healthyPets = ownedPets.filter((id) => !state.health.sickPets?.[id]);
    if (alreadyPlayerSick && healthyPets.length === 0) return null;

    state.health.ticksSinceSickCheck = (state.health.ticksSinceSickCheck || 0) + 1;
    if (source === 'tick' && state.health.ticksSinceSickCheck < 5) return null;

    const lowPlayer = (state.needs.energy || 80) < 28 || (state.needs.hunger || 70) < 25 || (state.needs.thirst ?? 80) < 25;
    const lowPet = (state.needs.petEnergy || 80) < 28 || (state.needs.petCare || 80) < 28;
    let chance = source === 'run' ? 0.06 : 0.014;
    if (lowPlayer || lowPet) chance *= 2.1;

    if (Math.random() >= chance) return null;

    state.health.lastSickTime = now;
    state.health.ticksSinceSickCheck = 0;

    const choosePet = healthyPets.length > 0 && (alreadyPlayerSick || Math.random() < 0.5);
    if (choosePet) {
      const petId = healthyPets[Math.floor(Math.random() * healthyPets.length)];
      const kinds = [
        { kind: 'cold', label: 'Kleiner Schnupfen' },
        { kind: 'tummy', label: 'Leichtes Bauchweh' }
      ];
      const pick = kinds[Math.floor(Math.random() * kinds.length)];
      state.health.sickPets[petId] = { ...pick, since: now };
      return { target: 'pet', petId, ...pick };
    }

    const pKinds = [
      { kind: 'cold', label: 'Leichte Erkältung' },
      { kind: 'tired', label: 'Hatschi-Schnupfen' }
    ];
    const pick = pKinds[Math.floor(Math.random() * pKinds.length)];
    state.health.playerSick = { ...pick, since: now };
    return { target: 'player', ...pick };
  },

  onRunCompleted() {
    const state = this.getState();
    const hasRobot = this.hasItem('supplies', 'robot_helper');
    const cleanDrop = hasRobot ? 5 : 12;
    state.needs.cleanliness = Math.max(15, state.needs.cleanliness - cleanDrop);
    state.needs.hunger = Math.max(10, state.needs.hunger - 14);
    state.needs.thirst = Math.max(10, (state.needs.thirst ?? 80) - 16);
    state.needs.energy = Math.max(10, (state.needs.energy ?? 88) - 16);
    if (state.owned.pets.length > 0) {
      state.needs.petCare = Math.max(10, state.needs.petCare - 15);
      state.needs.petEnergy = Math.max(10, (state.needs.petEnergy ?? 88) - 14);
    }
    this._maybeTriggerRareSickness(state, 'run');
    this.saveState(state);
    StoreRotationManager.advanceBatch();
  },

  tickNeeds(options = {}) {
    const { isSleeping = false } = options;
    const state = this.getState();
    const hasRobot = this.hasItem('supplies', 'robot_helper');
    if (!hasRobot || Math.random() < 0.4) {
      state.needs.cleanliness = Math.max(10, state.needs.cleanliness - 1);
    }
    state.needs.hunger = Math.max(10, state.needs.hunger - (isSleeping ? 0 : 1));
    state.needs.thirst = Math.max(10, (state.needs.thirst ?? 80) - (isSleeping ? 0 : 1));

    if (isSleeping) {
      const hasBed = this.hasItem('furniture', 'bed') || this.hasItem('expansions', 'bedroom');
      const energyGain = hasBed ? 12 : 8;
      state.needs.energy = Math.min(100, (state.needs.energy ?? 88) + energyGain);
      if (state.owned.pets.length > 0) {
        const hasPetBed = this.hasItem('petItems', 'pet_bed') || this.hasItem('petItems', 'pet_cushion');
        state.needs.petEnergy = Math.min(100, (state.needs.petEnergy ?? 88) + (hasPetBed ? 14 : 10));
      }
      if (state.needs.energy >= 95 && state.health?.playerSick) {
        state.health.playerSick = null;
      }
    } else {
      state.needs.energy = Math.max(8, (state.needs.energy ?? 88) - 1);
      if (state.owned.pets.length > 0) {
        state.needs.petCare = Math.max(10, state.needs.petCare - 1);
        state.needs.petEnergy = Math.max(8, (state.needs.petEnergy ?? 88) - 1);
      }
      this._maybeTriggerRareSickness(state, 'tick');
    }

    this.saveState(state);
    return state;
  },

  sleepStep(isDreamBed = false) {
    const state = this.getState();
    const gain = isDreamBed ? 8 : 5;
    state.needs.energy = Math.min(100, (state.needs.energy ?? 88) + gain);
    if (state.owned.pets.length > 0) {
      const hasPetBed = this.hasItem('petItems', 'pet_bed') || this.hasItem('petItems', 'pet_cushion');
      state.needs.petEnergy = Math.min(100, (state.needs.petEnergy ?? 88) + (hasPetBed ? 9 : 6));
    }
    let recovered = false;
    if (state.needs.energy >= 92 && state.health?.playerSick) {
      state.health.playerSick = null;
      recovered = true;
    }
    const sickIds = Object.keys(state.health?.sickPets || {});
    if (state.needs.petEnergy >= 94 && sickIds.length > 0) {
      state.health.sickPets = {};
      recovered = true;
    }
    this.saveState(state);
    return { state, recovered };
  },

  healPlayer() {
    const state = this.getState();
    if (!state.health?.playerSick) {
      return { ok: false, reason: 'healthy', state };
    }
    const meds = state.inventory.medicine || 0;
    if (meds <= 0) {
      return { ok: false, reason: 'no_medicine', state };
    }
    state.inventory.medicine = meds - 1;
    state.health.playerSick = null;
    state.needs.energy = Math.min(100, (state.needs.energy ?? 80) + 22);
    state.needs.hunger = Math.min(100, (state.needs.hunger ?? 70) + 10);
    this.saveState(state);
    const bonusCoins = 8;
    ShopManager.addCoins(bonusCoins);
    EarnMoneyManager.recordEvent({ care: 1 });
    return { ok: true, bonusCoins, remaining: state.inventory.medicine, state };
  },

  healPet(petId = 'all') {
    const state = this.getState();
    const sickMap = state.health?.sickPets || {};
    const sickIds = petId === 'all' ? Object.keys(sickMap) : (sickMap[petId] ? [petId] : []);
    if (sickIds.length === 0) {
      return { ok: false, reason: 'healthy', state };
    }
    const meds = state.inventory.petMedicine || 0;
    if (meds <= 0) {
      return { ok: false, reason: 'no_pet_medicine', state };
    }
    const targetId = sickIds[0];
    state.inventory.petMedicine = meds - 1;
    delete state.health.sickPets[targetId];
    state.needs.petCare = Math.min(100, (state.needs.petCare ?? 80) + 24);
    state.needs.petEnergy = Math.min(100, (state.needs.petEnergy ?? 80) + 18);
    this.saveState(state);
    const bonusCoins = 10;
    ShopManager.addCoins(bonusCoins);
    ShopManager.recordProgress(0, 1);
    EarnMoneyManager.recordEvent({ care: 1 });
    window.dispatchEvent(new CustomEvent('runner:pets-updated', { detail: { companionPets: state.companionPets } }));
    const item = HOME_CATALOG.pets.find((p) => p.id === targetId);
    return { ok: true, petId: targetId, item, bonusCoins, remaining: state.inventory.petMedicine, state };
  },

  eatFridgeSnack() {
    const state = this.getState();
    const snacks = state.inventory.fridgeSnacks || 0;
    if (snacks <= 0) {
      return { ok: false, reason: 'no_snacks' };
    }
    state.inventory.fridgeSnacks = snacks - 1;
    state.needs.hunger = Math.min(100, (state.needs.hunger || 0) + 25);
    this.saveState(state);
    EarnMoneyManager.recordEvent({ care: 1 });
    return { ok: true, remaining: state.inventory.fridgeSnacks, state };
  },

  drinkBeverage() {
    const state = this.getState();
    const drinks = state.inventory.drinks || 0;
    if (drinks > 0) {
      state.inventory.drinks = drinks - 1;
      state.needs.thirst = Math.min(100, (state.needs.thirst ?? 80) + 36);
      state.needs.energy = Math.min(100, (state.needs.energy ?? 88) + 4);
      this.saveState(state);
      const bonusCoins = 3;
      ShopManager.addCoins(bonusCoins);
      EarnMoneyManager.recordEvent({ care: 1 });
      return { ok: true, usedStock: true, remaining: state.inventory.drinks, bonusCoins, state };
    }
    state.needs.thirst = Math.min(100, (state.needs.thirst ?? 80) + 22);
    this.saveState(state);
    EarnMoneyManager.recordEvent({ care: 1 });
    return { ok: true, usedStock: false, remaining: 0, bonusCoins: 0, state };
  },

  cookMeal() {
    const state = this.getState();
    if ((state.inventory.food || 0) <= 0) {
      return { ok: false, reason: 'no_food' };
    }
    state.inventory.food -= 1;
    const hasKitchen = this.hasItem('expansions', 'kitchen');
    const hasBbq = this.hasItem('garden', 'bbq');
    const heal = hasKitchen ? 45 : 30;
    const bonusCoins = 7 + (hasKitchen ? 5 : 0) + (hasBbq ? 6 : 0);
    state.needs.hunger = Math.min(100, state.needs.hunger + heal);
    state.needs.cleanliness = Math.max(10, state.needs.cleanliness - 5);
    this.saveState(state);
    ShopManager.addCoins(bonusCoins);
    ShopManager.recordProgress(0, 1);
    EarnMoneyManager.recordEvent({ care: 1 });
    return { ok: true, bonusCoins, state };
  },

  cleanHouse() {
    const state = this.getState();
    if (state.needs.cleanliness >= 98) {
      return { ok: false, reason: 'already_clean' };
    }
    const hasVacuum = this.hasItem('supplies', 'vacuum');
    const hasRobot = this.hasItem('supplies', 'robot_helper');
    const boost = hasVacuum ? 50 : 32;
    const bonusCoins = 8 + (hasVacuum ? 5 : 0) + (hasRobot ? 4 : 0);
    state.needs.cleanliness = Math.min(100, state.needs.cleanliness + boost);
    this.saveState(state);
    ShopManager.addCoins(bonusCoins);
    ShopManager.recordProgress(0, 1);
    EarnMoneyManager.recordEvent({ care: 1 });
    return { ok: true, bonusCoins, state };
  },

  feedPets() {
    const state = this.getState();
    if (state.owned.pets.length === 0) {
      return { ok: false, reason: 'no_pets' };
    }
    if ((state.inventory.petFood || 0) <= 0) {
      return { ok: false, reason: 'no_pet_food' };
    }
    state.inventory.petFood -= 1;
    const hasBowl = this.hasItem('petItems', 'bowl');
    const hasFountain = this.hasItem('petItems', 'water_fountain');
    const boost = hasBowl ? 50 : 35;
    const bonusCoins = 10 + (hasFountain ? 4 : 0);
    state.needs.petCare = Math.min(100, state.needs.petCare + boost);
    this.saveState(state);
    ShopManager.addCoins(bonusCoins);
    ShopManager.recordProgress(0, 1);
    EarnMoneyManager.recordEvent({ care: 1 });
    return { ok: true, bonusCoins, state };
  },

  petAnimals() {
    const state = this.getState();
    if (state.owned.pets.length === 0) {
      return { ok: false, reason: 'no_pets' };
    }
    state.needs.petCare = Math.min(100, state.needs.petCare + 15);
    this.saveState(state);
    ShopManager.recordProgress(0, 1);
    EarnMoneyManager.recordEvent({ care: 1 });
    return { ok: true, state };
  },

  waterOrHarvestGarden() {
    const state = this.getState();
    if (state.needs.gardenGrowth >= 100) {
      let reward = 18;
      if (this.hasItem('garden', 'veggies')) reward += 10;
      if (this.hasItem('garden', 'apple_tree')) reward += 12;
      if (this.hasItem('garden', 'pond')) reward += 6;
      if (this.hasItem('garden', 'greenhouse')) reward += 15;
      state.needs.gardenGrowth = 10;
      this.saveState(state);
      ShopManager.addCoins(reward);
      ShopManager.recordProgress(0, 2);
      EarnMoneyManager.recordEvent({ care: 1 });
      return { ok: true, action: 'harvest', bonusCoins: reward, state };
    }

    const hasGoldCan = this.hasItem('supplies', 'gold_can');
    const hasGreenhouse = this.hasItem('garden', 'greenhouse');
    const growthStep = (hasGoldCan ? 50 : 30) + (hasGreenhouse ? 15 : 0);
    state.needs.gardenGrowth = Math.min(100, state.needs.gardenGrowth + growthStep);
    this.saveState(state);
    ShopManager.recordProgress(0, 1);
    EarnMoneyManager.recordEvent({ care: 1 });
    return { ok: true, action: 'water', state };
  }
};
