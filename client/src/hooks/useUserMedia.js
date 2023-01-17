import {useState, useEffect} from 'react';

export function useUserMedia(reqMedia) {
    const [ mediaStream, setMediaStream ] = useState(null);

    useEffect(() => {
        async function enableStream() {
            try {
                const stream = await navigator.mediaDevices.getUserMedia(reqMedia);
                setMediaStream(stream);
            } catch (err) {
                console.error(err);
            }
        }

        if(!mediaStream) {
            enableStream();
        } else {
            return function cleanup() {
                mediaStream.getTracks().forEach(track => {
                    track.stop();
                });
            }
        }
    }, [mediaStream, reqMedia]);

    return mediaStream;
}