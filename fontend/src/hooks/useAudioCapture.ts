import { useCallback, useEffect, useRef, useState } from 'react';

export interface AudioCaptureData {
  waveform: Float32Array;
  frequency: Uint8Array;
  rms: number;
  peak: number;
}

interface UseAudioCaptureResult {
  isCapturing: boolean;
  error: string | null;
  data: AudioCaptureData | null;
  startCapture: () => Promise<void>;
  stopCapture: () => void;
}

export function useAudioCapture(): UseAudioCaptureResult {
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AudioCaptureData | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const stopCapture = useCallback(() => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (streamRef.current) {
      for (const track of streamRef.current.getTracks()) {
        track.stop();
      }

      streamRef.current = null;
    }

    if (audioContextRef.current) {
      void audioContextRef.current.close();
      audioContextRef.current = null;
    }

    analyserRef.current = null;
    setIsCapturing(false);
  }, []);

  const startCapture = useCallback(async () => {
    try {
      setError(null);

      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error(
          'Microphone access is not supported by this browser.',
        );
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });

      const audioContext = new AudioContext();

      const analyser = audioContext.createAnalyser();

      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.8;

      const source = audioContext.createMediaStreamSource(stream);

      source.connect(analyser);

      streamRef.current = stream;
      audioContextRef.current = audioContext;
      analyserRef.current = analyser;

      const waveform = new Float32Array(analyser.fftSize);
      const frequency = new Uint8Array(analyser.frequencyBinCount);

      setIsCapturing(true);

      const updateAudioData = () => {
        const currentAnalyser = analyserRef.current;

        if (!currentAnalyser) {
          return;
        }

        currentAnalyser.getFloatTimeDomainData(waveform);
        currentAnalyser.getByteFrequencyData(frequency);

        let sumSquares = 0;
        let peak = 0;

        for (const sample of waveform) {
          sumSquares += sample * sample;

          const absoluteSample = Math.abs(sample);

          if (absoluteSample > peak) {
            peak = absoluteSample;
          }
        }

        const rmsLinear = Math.sqrt(sumSquares / waveform.length);

        const rms =
          rmsLinear > 0
            ? 20 * Math.log10(rmsLinear)
            : -Infinity;

        const peakDb =
          peak > 0
            ? 20 * Math.log10(peak)
            : -Infinity;

        setData({
          waveform: new Float32Array(waveform),
          frequency: new Uint8Array(frequency),
          rms,
          peak: peakDb,
        });

        animationFrameRef.current =
          requestAnimationFrame(updateAudioData);
      };

      updateAudioData();
    } catch (captureError) {
      stopCapture();

      const message =
        captureError instanceof Error
          ? captureError.message
          : 'Unable to access the microphone.';

      setError(message);
    }
  }, [stopCapture]);

  useEffect(() => {
    return () => {
      stopCapture();
    };
  }, [stopCapture]);

  return {
    isCapturing,
    error,
    data,
    startCapture,
    stopCapture,
  };
}