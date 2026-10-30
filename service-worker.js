const CACHE_VERSION = "1.4.3";
const CACHE_NAME = `aure-handball-${CACHE_VERSION}`;
const MUSIKK_CACHE_NAME = "aure-handball-musikk";

const FILER = [
    "./",
    "./index.html",
    "./publikum.html",
    "./manifest.json",
    "./data/klubber.json",
    "./data/musikk.json",
    "./data/reklame.json",
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
    "./lyd/Horn2.mp3",
    "./video/fairplay.mp4"
];

const NETWORK_FIRST = [
    "./",
    "./index.html",
    "./publikum.html",
    "./manifest.json",
    "./data/klubber.json",
    "./data/musikk.json",
    "./data/reklame.json"
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

self.addEventListener("fetch", event => {
    const request = event.request;

    if (request.method !== "GET") {
        return;
    }

    const url = new URL(request.url);

    if (url.origin !== self.location.origin) {
        return;
    }

    const relativSti =
        "./" + url.pathname
            .replace("/kontrollpanel/", "");

    const brukNetworkFirst =
        NETWORK_FIRST.includes(relativSti);

    if (brukNetworkFirst) {
        event.respondWith(
            fetch(request)
                .then(async response => {
                    if (
                        response &&
                        response.ok
                    ) {
                        const cache =
                            await caches.open(CACHE_NAME);

                        await cache.put(
                            request,
                            response.clone()
                        );
                    }

                    return response;
                })
                .catch(async () => {
                    const cachedResponse =
                        await caches.match(request);

                    if (cachedResponse) {
                        return cachedResponse;
                    }

                    return caches.match(
                        "./index.html"
                    );
                })
        );

        return;
    }

    event.respondWith(
        caches.match(request)
            .then(cachedResponse => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(request)
                    .then(async response => {
                        if (
                            response &&
                            response.ok
                        ) {
                            const cache =
                                await caches.open(CACHE_NAME);

                            await cache.put(
                                request,
                                response.clone()
                            );
                        }

                        return response;
                    });
            })
            .catch(() => {
                return caches.match(
                    "./index.html"
                );
            })
    );
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames
                        .filter(name => {
                            const erGammelAppCache =
                                name.startsWith("aure-handball-") &&
                                name !== CACHE_NAME &&
                                name !== MUSIKK_CACHE_NAME;

                            return erGammelAppCache;
                        })
                        .map(name => {
                            console.log(
                                "Sletter gammel app-cache:",
                                name
                            );

                            return caches.delete(name);
                        })
                );
            })
            .then(() => self.clients.claim())
    );
});

// ============================================================
// MELDINGER FRA KONTROLLPANELET
// ============================================================

self.addEventListener("message", event => {
    if (event.data?.type !== "HENT_APPVERSJON") {
        return;
    }

    const svar = {
        type: "APPVERSJON",
        versjon: CACHE_VERSION,
        cacheNavn: CACHE_NAME
    };

    if (event.ports && event.ports[0]) {
        event.ports[0].postMessage(svar);
        return;
    }

    if (event.source) {
        event.source.postMessage(svar);
    }
});
