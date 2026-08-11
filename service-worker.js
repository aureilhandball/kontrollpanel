const CACHE_NAVN =
    "aure-handball-v1";

const FILER = [

    "/",
    "/index.html",
    "/publikum.html",
    "/manifest.json",
    "/data/klubber.json"

];

self.addEventListener(
    "install",
    event => {

        event.waitUntil(

            caches.open(
                CACHE_NAVN
            )
            .then(cache => {

                return cache.addAll(
                    FILER
                );

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

                return (
                    response ||
                    fetch(
                        event.request
                    )
                );

            })

        );

    }
);
