import React, { useRef, useEffect } from 'react';

const AudioRecord = (props) => {
  const audioRef = useRef(null);

  useEffect(() => {
    const base64String = props.base64String;

    if (audioRef.current && base64String) {
      
      const byteCharacters = atob(base64String);
      const byteNumbers = new Array(byteCharacters.length);

      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      const audioBlob = new Blob([byteArray], { type: 'audio/webm;codecs=opus' });

      const audioUrl = URL.createObjectURL(audioBlob);

      audioRef.current.src = audioUrl;
      //console.log(audioUrl);
    }
  }, [props.base64String]);

  return (
    <audio ref={audioRef} controls />
  );
};

export default AudioRecord;
