import React, { useRef } from 'react';
import { useUserMedia } from './hooks/useUserMedia';

const CAPTURE_OPTIONS = {
    audio: true,
    video: { facingMode: 'environment' },
}

export function Camera() {
    const videoRef = useRef();
    const mediaStream = useUserMedia(CAPTURE_OPTIONS);

    if(mediaStream && videoRef.current && !videoRef.current.srcObject) {
        videoRef.current.srcObject = mediaStream;
    }

    function handlePlay() {
        videoRef.current.play();
    }

    return (
        <video ref={videoRef} onCanPlay={handlePlay} autoPlay playsInline muted></video>
    )
}