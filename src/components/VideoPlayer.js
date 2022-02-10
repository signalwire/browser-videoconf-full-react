import React, { useEffect, useState, useRef } from "react";

export default function VideoPlayer({
    src,
    refreshInterval
}) {

    const mydiv = useRef(null);
    const [loading, setLoading] = useState(true)
    const [srcUrl, setSrcUrl] = useState(src)

    useEffect(() => {
        refreshVideo()

        const timer = setInterval(() => {
            refreshVideo()
        }, refreshInterval)

        return () => {
            if (timer) clearInterval(timer)
        }
    }, [src, refreshInterval])

    async function refreshVideo() {
        const videoEl = mydiv.current.querySelector('video')

        if (loading) {
            const result = await fetch(src)
            if (result.status < 400) {
                setSrcUrl(src)
                setLoading(false)
            } else {
                // Try again in a sec
                setTimeout(() => refreshVideo(), 1000)
            }
        } else {
            const url = new URL(src);
            url.searchParams.set('t', +new Date())
            setSrcUrl(url.toString())
        }
    }

    // needed to preserve the "muted" attribute
    // see https://github.com/facebook/react/issues/10389
    const videoElement = {__html: `<video src="${loading ? 'https://hq.api.sw.work/media/loading_loop.mp4' : srcUrl}" autoPlay loop muted playsInline style="width: 100%;"></video>`}
    //const videoElement = {__html: `<video src="${loading ? 'https://hq.api.sw.work/media/loading_loop.mp4' : srcUrl}" autoPlay loop muted playsInline oncanplay="this.play()" onpause="this.play()" onloadedmetadata="this.muted=true" oncanplaythrough="this.muted = true;this.play()" style="width: 100%;"></video>`}

    return <div ref={mydiv} dangerouslySetInnerHTML={videoElement}></div>
}
