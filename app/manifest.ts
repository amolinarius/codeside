import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "Codeside",
        short_name: "Codeside",
        description: "A Progressive Web App to learn Python",
        id: "/",
        start_url: "/",
        display: "standalone",
        background_color: "#fff",
        theme_color: "#000",
        icons: [
            { src: '/logo-96x96.png', sizes: '96x96', type: 'image/png' },
            { src: '/logo-192x192.png', sizes: '192x192', type: 'image/png' },
            { src: '/logo-512x512.png', sizes: '512x512', type: 'image/png' }
        ]
    }
}