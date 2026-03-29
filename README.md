# Wearable Assistive AI System for Alzheimer’s Patients

## Overview

This project is a **full-stack assistive system** designed to support individuals with Alzheimer’s by helping them recognize people, recall important information, and assist caregivers with real-time insights.

The system combines:

- A **Raspberry Pi-based wearable device** (camera + audio output)
- A **caregiver dashboard (web app)**
- A **voice-enabled AI assistant powered by ElevenLabs**

Together, these components create a **memory support ecosystem** that enhances daily interactions and reduces confusion for patients.

---

## Key Features

### Face Recognition (Wearable Device)

- Detects and recognizes known individuals in real-time
- Uses multiple images per person for improved accuracy
- Outputs contextual audio:
  - “This is your daughter, Sarah”

---

### Caregiver Dashboard (Web App)

A centralized platform for managing patient data and system behavior.

#### Features

- Add/edit **people profiles**
  - Name, relationship, notes, memory cues
- Upload **multiple images per person**
- Manage **reminders**
  - Medication schedules
  - Appointments
- View **recognition history**
- Track **activity logs**

---

### Voice Assistant (Accessibility Feature)

A voice-enabled assistant for caregivers built using ElevenLabs.

#### Capabilities

- Ask natural language questions:
  - “What reminders are scheduled today?”
  - “Who was recognized recently?”
- Retrieves real-time data from backend
- Responds with structured, spoken answers

---

### Intelligent Memory System

- Prioritizes critical information:
  - Medication
  - Appointments
- Provides structured responses
- Avoids hallucination by using only backend data

---

## System Architecture

```text
Wearable Device (Raspberry Pi)
        ↓
Camera Input → Face Recognition → Audio Output
        ↓
-----------------------------------------
        ↓
Web Dashboard (Next.js)
        ↓
Backend API (/api/assistant)
        ↓
Database (Firebase / Firestore + Storage)
        ↓
ElevenLabs API
   ↙            ↘
STT              TTS
(Speech→Text)    (Text→Speech)

## Tech Stack

### Hardware

- Raspberry Pi Zero 2 W
- Raspberry Pi Camera Module 3
- MAX98357A I2S Amplifier
- LiPo Battery + Power Modules

### Software

#### Frontend

- Next.js
- React

#### Backend

- Next.js API Routes
- Firebase
  - Firestore (database)
  - Firebase Storage (media)

#### AI & Voice

- ElevenLabs API
  - Speech-to-Text (STT)
  - Text-to-Speech (TTS)

#### Computer Vision

- OpenCV
- face_recognition (Python)

---

## API Integration (ElevenLabs)

### Setup

Create a `.env.local` file:

```env
ELEVENLABS_API_KEY=your_api_key_here
