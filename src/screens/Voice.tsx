import { useState } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { useAudioRecorder, RecordingPresets } from 'expo-audio';
import { AHScreen, AHProgress, AHTitle, AHButton, AHOrb, AHWave, pressedOpacity } from '../components/ui';
import { MUTED, LINE2, ACCENT } from '../theme';
import { useNav } from '../nav';
import { requestMicPermission } from '../permissions';
import { API_BASE, ApiError, getCachedToken } from '../apiClient';

async function uploadAudio(uri: string): Promise<string | null> {
  const token = getCachedToken();
  if (!token) {
    Alert.alert('Sign in to save', 'Sign in to upload your voice note.');
    return null;
  }
  try {
    const r = await fetch(uri);
    const body = await r.arrayBuffer();
    const res = await fetch(`${API_BASE}/api/media/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'audio/m4a' },
      body,
    });
    const payload = await res.json().catch(() => null) as { url?: string; error?: string } | null;
    if (!res.ok) throw new ApiError(res.status, payload, payload?.error ?? `HTTP ${res.status}`);
    return payload?.url ?? null;
  } catch (e) {
    Alert.alert('Upload failed', String((e as Error).message ?? e));
    return null;
  }
}

// 06 · Voice-first setup.
export function Voice() {
  const nav = useNav();
  const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [recording, setRecording] = useState(false);
  const [busy, setBusy] = useState(false);
  const [lastClip, setLastClip] = useState<string | null>(null);
  const [permGranted, setPermGranted] = useState<boolean | null>(null);

  const askMic = async () => {
    const ok = await requestMicPermission();
    setPermGranted(ok);
    if (ok) Alert.alert('Microphone enabled', 'You can hold the mic to talk to aihoni.');
  };

  const startRecording = async () => {
    if (busy || recording) return;
    const ok = await requestMicPermission();
    setPermGranted(ok);
    if (!ok) return;
    setBusy(true);
    try {
      await recorder.prepareToRecordAsync();
      recorder.record();
      setRecording(true);
    } catch (e) {
      Alert.alert('Could not start recording', String((e as Error).message ?? e));
    } finally {
      setBusy(false);
    }
  };

  const stopRecording = async () => {
    if (!recording) return;
    setBusy(true);
    try {
      await recorder.stop();
      setRecording(false);
      const uri = recorder.uri;
      if (uri) {
        const url = await uploadAudio(uri);
        if (url) setLastClip(url);
      }
    } catch (e) {
      Alert.alert('Recording failed', String((e as Error).message ?? e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AHScreen>
      <AHProgress step={4} />
      <AHTitle
        np="बोलेर सोध्नुहोस्"
        en="Just talk to aihoni"
        sub="No typing needed. Press the button, ask in Nepali or English."
      />

      <View style={{ flexDirection: 'column', gap: 10, marginTop: 4 }}>
        <View style={{ alignSelf: 'flex-end', maxWidth: 270 }}>
          <View
            style={{
              backgroundColor: '#1B1B1F',
              borderRadius: 20,
              borderBottomRightRadius: 6,
              padding: 16,
            }}
          >
            <Text style={{ color: '#fff', fontSize: 15.5, lineHeight: 22 }}>
              {"\"आज तरकारीको भाउ कस्तो छ?\""}
            </Text>
          </View>
        </View>
        <View style={{ alignSelf: 'flex-start', maxWidth: 280 }}>
          <View
            style={{
              backgroundColor: '#fff',
              borderWidth: 1.5,
              borderColor: LINE2,
              borderRadius: 20,
              borderBottomLeftRadius: 6,
              padding: 16,
            }}
          >
            <Text style={{ fontSize: 15.5, lineHeight: 22 }}>
              {'नमस्ते सुनिता जी! आजको कालीमाटी थोक भाउ अनुसार…'}
            </Text>
            <AHWave n={10} />
          </View>
        </View>
      </View>

      <View style={{ flex: 1 }} />

      <View
        style={{
          flexDirection: 'column',
          alignItems: 'center',
          gap: 14,
          marginBottom: 18,
        }}
      >
        <Pressable
          onPressIn={startRecording}
          onPressOut={stopRecording}
          android_ripple={{ color: 'rgba(255,255,255,0.18)', borderless: true, radius: 56 }}
          style={pressedOpacity({ borderRadius: 60 }, 0.85)}
        >
          <AHOrb size={104} />
        </Pressable>
        <Text style={{ fontSize: 14, fontWeight: '600', color: recording ? ACCENT : MUTED }}>
          {recording
            ? '● Recording — release to send'
            : busy
            ? 'Working…'
            : lastClip
            ? 'Hold to record again'
            : 'Hold to speak · थिचेर बोल्नुहोस्'}
        </Text>
      </View>

      <AHButton kind="primary" onClick={permGranted ? nav.next : askMic}>
        {permGranted ? 'Continue' : 'Allow microphone'}
      </AHButton>
      <AHButton kind="ghost" onClick={nav.next}>
        {"I'd rather type ›"}
      </AHButton>
    </AHScreen>
  );
}
