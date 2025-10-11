---
title: Concepts · Cloudflare Realtime docs
description: This page explains the core concepts and terminology used in RealtimeKit.
lastUpdated: 2025-08-18T10:34:43.000Z
chatbotDeprioritize: false
source_url:
  html: https://developers.cloudflare.com/realtime/realtimekit/concepts/
  md: https://developers.cloudflare.com/realtime/realtimekit/concepts/index.md
---

This page explains the core concepts and terminology used in RealtimeKit.

### Meeting

A **Meeting** is the fundamental communication channel in RealtimeKit. You can think of it like an event on your calendar - it's a persistent, long-lived container or "room" that serves as a blueprint for its [sessions](https://developers.cloudflare.com/realtime/realtimekit/concepts/#session). Every session created for this meeting inherits the same base configuration, such as the title of the meeting and whether to automatically record the session when it starts. You add participants to the meeting, which grants them access to join a session of that meeting.

### Session

A **Session** is a single, live instance of a meeting. To continue the analogy, if a meeting is the calendar event, the session is the actual video call you join. It begins when the first participant joins and ends shortly after the last participant leaves. Each session is unique and has its own lifecycle, including its own set of participants and associated data like chat messages and recordings.

For example, you might have a recurring "Weekly Standup" **meeting** with five participants added to it. The standup that takes place on Monday, August 11th at 11:30 AM is a specific **session**. All five participants can join this session using their unique `authToken`. For the following week's standup, you could create a new meeting and add participants again, or you could simply reuse the existing meeting and auth tokens (as long as they haven't expired) to create a new session.

### Preset

A **Preset** is a powerful template that defines a participant's role, permissions, and UI experience within a session. Beyond controlling permissions for actions like producing video and audio, sharing screens, and creating polls, presets also allow you to customize the look and feel of the UI, including colors and themes to match your app's branding.

Different participants in the same meeting can have different presets, allowing for complex and flexible roles. For example, in a large ed-tech class:

* The **teacher** might join with a `webinar-host` preset, giving them full control to share video, audio, and their screen.
* **Students** would join with a `webinar-participant` preset, which restricts them from sharing media but allows them to use the chat to ask questions.
* A **teaching assistant** could join with a `group-call-host` preset, enabling them to view all participants in a grid to monitor the class.

### Participant

A **Participant** is the server-side representation of a user within a session. When you add a user to a meeting via the REST API, a participant is created. This API call returns a unique `authToken` that the client-side SDK uses to join the session and authenticate the user.

### Peer

A **Peer** is the client-side representation of a [participant](https://developers.cloudflare.com/realtime/realtimekit/concepts/#participant) in a session. While the terms are sometimes used interchangeably, a peer represents a specific instance of a participant joining the meeting. For example, if a single user joins the same meeting from two different browser tabs, they will have the same participant ID (also referred to as a user ID) but two unique peer IDs.

### Stage

The **Stage** is the logical space within a video call where participants can actively share their audio and video. In use cases like webinars, a participant's preset determines whether they have permission to be "on stage" as a presenter or if they are an audience member who only consumes the content.

### Waiting Room

The **Waiting Room** is a virtual lobby that provides an extra layer of security. When enabled, participants are held in the waiting room until a host with the proper permissions explicitly admits them into the main session. This is useful for controlling access to private or sensitive meetings.

### Core SDK

The **Core SDK** is the client-side library that provides the business logic for all of RealtimeKit's features. It is a data-only library that handles the complex media and networking tasks, giving you full control to build a completely custom user interface. It serves as the foundation upon which the UI Kit is built.

### UI Kit

The **UI Kit** is a library of pre-built, customizable UI components that sits on top of the Core SDK. It provides the fastest and simplest way to integrate a complete video and voice call interface into any application, allowing you to get started with just a few lines of code while still offering flexibility for customization.

### Realtime SFU (Selective Forwarding Unit)

A **Selective Forwarding Unit (SFU)** is a server architecture that efficiently manages real-time media streams in multi-party video calls. Instead of each participant sending their media directly to every other participant in a bandwidth-intensive mesh network, each participant sends a single stream to the SFU. The SFU then forwards those streams to the other participants, making it a highly scalable model.

The [**Realtime SFU**](https://developers.cloudflare.com/realtime/sfu) is Cloudflare's implementation of this architecture and is the core engine that powers RealtimeKit. It runs on Cloudflare's global Anycast network, meaning participants automatically connect to the nearest data center. This minimizes latency and ensures a high-quality experience regardless of a user's location. The SFU intelligently routes media, handling the complex task of receiving multiple streams and forwarding them to the appropriate participants.
