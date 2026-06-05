import torch
import librosa
import numpy as np

from transformers import (
    Wav2Vec2Processor,
    Wav2Vec2Model
)

# ==========================================
# DEVICE
# ==========================================
device = torch.device(
    "cuda" if torch.cuda.is_available()
    else "cpu"
)

# ==========================================
# LOAD WAV2VEC2
# ==========================================
processor = Wav2Vec2Processor.from_pretrained(
    "facebook/wav2vec2-base-960h"
)

wav2vec = Wav2Vec2Model.from_pretrained(
    "facebook/wav2vec2-base-960h"
).to(device)

wav2vec.eval()

# ==========================================
# AUDIO LOADING + SEGMENTATION
# ==========================================
def load_audio_segments(
    path,
    sr=16000,
    segment_length=40
):

    # LOAD AUDIO
    y, _ = librosa.load(path, sr=sr)

    # NORMALIZATION
    y = librosa.util.normalize(y)

    # SILENCE REMOVAL
    intervals = librosa.effects.split(
        y,
        top_db=20
    )

    y = np.concatenate([
        y[start:end]
        for start, end in intervals
    ])

    # PRE-EMPHASIS FILTER
    y = np.append(
        y[0],
        y[1:] - 0.97 * y[:-1]
    )

    # SEGMENTATION
    segment_samples = sr * segment_length

    segments = []

    for start in range(
        0,
        len(y),
        segment_samples
    ):

        end = start + segment_samples

        segment = y[start:end]

        # SKIP VERY SMALL SEGMENTS
        if len(segment) < sr * 1:
            continue

        # PAD SHORT SEGMENTS
        if len(segment) < segment_samples:

            padding = np.zeros(
                segment_samples - len(segment)
            )

            segment = np.concatenate([
                segment,
                padding
            ])

        segments.append(segment)

    return segments, sr


# ==========================================
# FEATURE EXTRACTION
# ==========================================
def extract_features(path):

    segments, sr = load_audio_segments(path)

    wav_segment_features = []

    handcrafted_segment_features = []

    # PROCESS EACH SEGMENT
    for segment in segments:

        # ==================================
        # WAV2VEC2 FEATURES
        # ==================================
        inputs = processor(
            segment,
            sampling_rate=sr,
            return_tensors="pt",
            padding=True
        ).to(device)

        with torch.no_grad():

            outputs = wav2vec(**inputs)

        wav_feat = (
            outputs.last_hidden_state
            .squeeze(0)
            .cpu()
        )

        wav_segment_features.append(
            wav_feat
        )

        # ==================================
        # MFCC FEATURES
        # ==================================
        mfcc = librosa.feature.mfcc(
            y=segment,
            sr=sr,
            n_mfcc=20
        )

        # NORMALIZATION
        mfcc = (
            mfcc - np.mean(mfcc)
        ) / (np.std(mfcc) + 1e-6)

        # DELTA FEATURES
        delta = librosa.feature.delta(mfcc)

        delta2 = librosa.feature.delta(
            mfcc,
            order=2
        )

        # PITCH
        pitches, _ = librosa.piptrack(
            y=segment,
            sr=sr
        )

        pitch = np.mean(pitches)

        # ENERGY
        energy = np.mean(
            librosa.feature.rms(y=segment)
        )

        handcrafted = np.concatenate([

            np.mean(mfcc, axis=1),

            np.mean(delta, axis=1),

            np.mean(delta2, axis=1),

            [pitch],

            [energy]
        ])

        handcrafted_segment_features.append(
            handcrafted
        )

    # ======================================
    # PAD SEGMENTS TO SAME LENGTH
    # ======================================
    max_seq_len = max(
        w.shape[0]
        for w in wav_segment_features
    )

    padded_segments = []

    for w in wav_segment_features:

        pad_len = max_seq_len - w.shape[0]

        if pad_len > 0:

            padding = torch.zeros(
                pad_len,
                w.shape[1]
            )

            w = torch.cat(
                [w, padding],
                dim=0
            )

        padded_segments.append(w)

    # ======================================
    # STACK + AVERAGE SEGMENTS
    # ======================================
    wav_feat = torch.stack(
        padded_segments
    ).mean(dim=0)

    # ======================================
    # HANDCRAFTED FEATURE AGGREGATION
    # ======================================
    handcrafted = np.mean(
        handcrafted_segment_features,
        axis=0
    )

    handcrafted = torch.tensor(
        handcrafted
    ).float()

    return wav_feat, handcrafted


# ==========================================
# PREDICTION FUNCTION
# ==========================================
def predict(model, audio_path):

    wav_feat, handcrafted = extract_features(
        audio_path
    )

    # NORMALIZATION
    wav_feat = (
        wav_feat - wav_feat.mean()
    ) / (wav_feat.std() + 1e-6)

    handcrafted = (
        handcrafted - handcrafted.mean()
    ) / (handcrafted.std() + 1e-6)

    # ADD BATCH DIMENSION
    wav_feat = wav_feat.unsqueeze(0)

    handcrafted = handcrafted.unsqueeze(0)

    wav_feat = wav_feat.to(device)

    handcrafted = handcrafted.to(device)

    # MODEL PREDICTION
    with torch.no_grad():

        output = model(
            wav_feat,
            handcrafted
        )

    return output.item()