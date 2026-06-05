import torch
import torch.nn as nn


# ==========================================
# WAV2VEC2 CNN + MHA BRANCH
# ==========================================
class CNN_MHA_Branch(nn.Module):

    def __init__(self, input_dim):

        super().__init__()

        self.conv1 = nn.Conv1d(
            input_dim,
            128,
            kernel_size=3,
            padding=1
        )

        self.bn1 = nn.BatchNorm1d(128)

        self.conv2 = nn.Conv1d(
            128,
            256,
            kernel_size=3,
            padding=1
        )

        self.bn2 = nn.BatchNorm1d(256)

        self.conv3 = nn.Conv1d(
            256,
            512,
            kernel_size=3,
            padding=1
        )

        self.bn3 = nn.BatchNorm1d(512)

        self.relu = nn.ReLU()

        self.pool = nn.MaxPool1d(2)

        self.dropout = nn.Dropout(0.3)

        self.mha = nn.MultiheadAttention(
            embed_dim=512,
            num_heads=8,
            batch_first=True
        )

        self.fc = nn.Linear(512, 256)

    def forward(self, x):

        x = x.permute(0, 2, 1)

        # CNN BLOCK 1
        x = self.conv1(x)
        x = self.bn1(x)
        x = self.relu(x)
        x = self.pool(x)
        x = self.dropout(x)

        # CNN BLOCK 2
        x = self.conv2(x)
        x = self.bn2(x)
        x = self.relu(x)
        x = self.pool(x)
        x = self.dropout(x)

        # CNN BLOCK 3
        x = self.conv3(x)
        x = self.bn3(x)
        x = self.relu(x)
        x = self.pool(x)
        x = self.dropout(x)

        x = x.permute(0, 2, 1)

        attn_output, _ = self.mha(x, x, x)

        x = attn_output.mean(dim=1)

        x = self.fc(x)

        return x


# ==========================================
# HANDCRAFTED FEATURE BRANCH
# ==========================================
class ArtBranch(nn.Module):

    def __init__(self):

        super().__init__()

        self.fc1 = nn.Linear(62, 128)

        self.conv1 = nn.Conv1d(
            1,
            64,
            kernel_size=3,
            padding=1
        )

        self.bn1 = nn.BatchNorm1d(64)

        self.conv2 = nn.Conv1d(
            64,
            128,
            kernel_size=3,
            padding=1
        )

        self.bn2 = nn.BatchNorm1d(128)

        self.relu = nn.ReLU()

        self.pool = nn.MaxPool1d(2)

        self.dropout = nn.Dropout(0.3)

        self.mha = nn.MultiheadAttention(
            embed_dim=128,
            num_heads=4,
            batch_first=True
        )

        self.fc2 = nn.Linear(128, 256)

    def forward(self, x):

        x = self.fc1(x)

        x = self.relu(x)

        x = x.unsqueeze(1)

        # CNN BLOCK 1
        x = self.conv1(x)
        x = self.bn1(x)
        x = self.relu(x)
        x = self.pool(x)
        x = self.dropout(x)

        # CNN BLOCK 2
        x = self.conv2(x)
        x = self.bn2(x)
        x = self.relu(x)
        x = self.pool(x)
        x = self.dropout(x)

        x = x.permute(0, 2, 1)

        attn_output, _ = self.mha(x, x, x)

        x = attn_output.mean(dim=1)

        x = self.fc2(x)

        return x


# ==========================================
# FINAL FUSION MODEL
# ==========================================
class DepressionModel(nn.Module):

    def __init__(self):

        super().__init__()

        self.wav_branch = CNN_MHA_Branch(768)

        self.art_branch = ArtBranch()

        self.fusion = nn.Sequential(

            nn.Linear(512, 256),

            nn.ReLU(),

            nn.Dropout(0.3),

            nn.Linear(256, 64),

            nn.ReLU(),

            nn.Dropout(0.3),

            nn.Linear(64, 1)
        )

    def forward(self, wav, art):

        wav_out = self.wav_branch(wav)

        art_out = self.art_branch(art)

        fused = torch.cat(
            [wav_out, art_out],
            dim=1
        )

        out = self.fusion(fused)

        return torch.sigmoid(out)