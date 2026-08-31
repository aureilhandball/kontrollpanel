const CACHE_VERSION = "1.3.0";
const CACHE_NAME = `aure-handball-${CACHE_VERSION}`;

const FILER = [
    "./",
    "./index.html",
    "./publikum.html",
    "./manifest.json",
    "./data/klubber.json",
    "./data/musikk.json",
    "./bilder/spiller.png",
    "./bilder/nhf.png",
    "./bilder/nhfrn1.png",
    "./bilder/ball.png",
    "./bilder/fairplay.png",
    "./bilder/icon-192.png",
    "./bilder/icon-512.png",
    "./bilder/favicon.png",
    "./logoer/default.png",
    "./logoer/aure.png",
    "./logoer/traeff.png",
    "./logoer/molde.png",
    "./logoer/khk.png",
    "./logoer/aksla.png",
    "./logoer/bergsoy.png",
    "./logoer/byasen.png",
    "./logoer/byneset.png",
    "./logoer/charlottenlund.png",
    "./logoer/froya.png",
    "./logoer/godoy.png",
    "./logoer/halsabk.png",
    "./logoer/haram.png",
    "./logoer/hitra.png",
    "./logoer/hodd.png",
    "./logoer/kattem.png",
    "./logoer/klabu.png",
    "./logoer/kyrksaterora.png",
    "./logoer/leik.png",
    "./logoer/lensvik.png",
    "./logoer/melhus.png",
    "./logoer/midsund.png",
    "./logoer/ntnui.png",
    "./logoer/oppdal.png",
    "./logoer/orkanger.png",
    "./logoer/orkangerorkdal.png",
    "./logoer/orkdal.png",
    "./logoer/rival.png",
    "./logoer/sjetne.png",
    "./logoer/skaun.png",
    "./logoer/skaunleik.png",
    "./logoer/stranda.png",
    "./logoer/surnadal.png",
    "./logoer/sverresborg.png",
    "./logoer/tiller.png",
    "./logoer/tronderlyn.png",
    "./logoer/utleira.png",
    "./logoer/valder.png",
    "./video/fairplay.mp4"
];

self.addEventListener("install", event => {
    self.skipWaiting();

    event.waitUntil(
        caches.open(CACHE_NAME).then(async cache => {
            for (const fil of FILER) {
                try {
                    await cache.add(fil);
                    console.log("Cached:", fil);
                }
                catch (error) {
                    console.error(
                        "Kunne ikke cache:",
                        fil
                    );
                }
            }
        })
    );
});

self.addEventListener(
    "fetch",
    event => {

        event.respondWith(

            caches.match(
                event.request
            )

            .then(response => {

                if (response) {

                    return response;

                }

                return fetch(
                    event.request
                );

            })

            .catch(() => {

                return caches.match(
                    "./index.html"
                );

            })

        );

    }
);
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(cacheNames =>
            Promise.all(
                cacheNames
                    .filter(name => name !== CACHE_NAME)
                    .map(name => caches.delete(name))
            )
        ).then(() => self.clients.claim())
    );
});
