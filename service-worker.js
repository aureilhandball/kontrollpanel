const CACHE_NAVN =
    "aure-handball-v1";

const FILER = [

    "./",
    "./index.html",
    "./publikum.html",
    "./manifest.json",
    "./data/klubber.json",

    "./bilder/spiller.png",
    "./bilder/nhf.png",
    "./bilder/fairplay.png",
    "./logoer/default.png",

    "./bilder/icon-192.png",
    "./bilder/icon-512.png"

];

self.addEventListener(
    "install",
    event => {

        event.waitUntil(

            caches.open(
                CACHE_NAVN
            )
            .then(async cache => {

                for (const fil of FILER) {

                    try {

                        await cache.add(
                            fil
                        );

                        console.log(
                            "Cached:",
                            fil
                        );

                    }

                    catch(error) {

                        console.error(
                            "Kunne ikke cache:",
                            fil
                        );

                    }

                }

            })

        );

    }
);

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
